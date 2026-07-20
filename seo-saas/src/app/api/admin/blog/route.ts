import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';
import { pingIndexNow } from '@/lib/indexnow';

const SITE = 'https://seosnapshot.dev';

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token, process.env.NEXTAUTH_SECRET || '');
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// GET — list all posts, or a single post WITH its full content when ?slug= (or
// ?id=) is given. The full form backs in-place content edits (fetch markdown,
// modify, PUT it back) without losing the source to an HTML round-trip.
export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  if (slug || id) {
    const post = await prisma.blogPost.findUnique({ where: slug ? { slug } : { id: id! } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post });
  }
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, published: true, createdAt: true },
  });
  return NextResponse.json({ posts });
}

// POST — create/publish a new post
export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || '').trim();
  const content = String(body.content || '').trim();
  const excerpt = String(body.excerpt || '').trim() || null;
  const category = String(body.category || 'Article').trim() || 'Article';
  const published = body.published !== false;
  const slug = slugify(body.slug ? String(body.slug) : title);

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ error: 'Could not derive a valid slug from the title' }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: `Slug "${slug}" already exists` }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: { slug, title, content, excerpt, category, published },
  });

  // Best-effort instant indexing (Bing/Yandex). Google uses the sitemap.
  if (published) {
    await pingIndexNow([`${SITE}/blog/${slug}`, `${SITE}/blog`, `${SITE}/sitemap.xml`]);
  }

  return NextResponse.json({ ok: true, slug: post.slug, url: `${SITE}/blog/${post.slug}` });
}

// PUT — update an existing post in place (identified by slug or id), preserving
// createdAt and the URL. Only the fields present in the body are changed, so a
// content-only edit leaves the title/category untouched.
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.slug ? String(body.slug) : '';
  const id = body.id ? String(body.id) : '';
  if (!slug && !id) {
    return NextResponse.json({ error: 'slug or id required to identify the post' }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: slug ? { slug } : { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Build a partial update from only the fields that were provided.
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    data.title = title;
  }
  if (body.content !== undefined) {
    const content = String(body.content).trim();
    if (!content) return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    data.content = content;
  }
  if (body.excerpt !== undefined) data.excerpt = String(body.excerpt).trim() || null;
  if (body.category !== undefined) data.category = String(body.category).trim() || 'Article';
  if (body.published !== undefined) data.published = body.published !== false;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const post = await prisma.blogPost.update({ where: { id: existing.id }, data });

  // Nudge Bing/Yandex to recrawl the changed URL; Google picks it up via sitemap.
  if (post.published) {
    await pingIndexNow([`${SITE}/blog/${post.slug}`, `${SITE}/blog`, `${SITE}/sitemap.xml`]);
  }

  return NextResponse.json({ ok: true, slug: post.slug, url: `${SITE}/blog/${post.slug}` });
}

// DELETE — remove a post by ?slug= or ?id=
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  if (!slug && !id) {
    return NextResponse.json({ error: 'slug or id required' }, { status: 400 });
  }
  await prisma.blogPost.deleteMany({ where: slug ? { slug } : { id: id! } });
  return NextResponse.json({ ok: true });
}
