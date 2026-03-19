'use client';
import { useEffect, useState } from 'react';

const EXAMPLES = ['google.com', 'stripe.com', 'github.com', 'your-site.com'];

export function TypeWriter() {
  const [text, setText] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = EXAMPLES[exampleIdx];

    if (!deleting && charIdx <= current.length) {
      const timer = setTimeout(() => {
        setText(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, charIdx === 0 ? 400 : 60 + Math.random() * 40);
      return () => clearTimeout(timer);
    }

    if (!deleting && charIdx > current.length) {
      const timer = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(timer);
    }

    if (deleting && charIdx > 0) {
      const timer = setTimeout(() => {
        setCharIdx(c => c - 1);
        setText(current.slice(0, charIdx - 1));
      }, 30);
      return () => clearTimeout(timer);
    }

    if (deleting && charIdx === 0) {
      setDeleting(false);
      setExampleIdx(i => (i + 1) % EXAMPLES.length);
    }
  }, [charIdx, deleting, exampleIdx]);

  return (
    <span className="text-white/25">
      {text || '\u00A0'}
      <span className="inline-block w-[2px] h-[1.1em] bg-accent-400/60 ml-[1px] align-middle animate-pulse" />
    </span>
  );
}
