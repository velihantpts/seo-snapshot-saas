import { estimatePixelWidth } from '../src/lib/analyzer/types';

describe('Pixel Width Estimation', () => {
  test('empty string returns 0', () => {
    expect(estimatePixelWidth('')).toBe(0);
  });

  test('single character returns a width', () => {
    const w = estimatePixelWidth('A');
    expect(w).toBeGreaterThan(0);
  });

  test('wider chars produce larger widths', () => {
    const narrow = estimatePixelWidth('iiii');
    const wide = estimatePixelWidth('WWWW');
    expect(wide).toBeGreaterThan(narrow);
  });

  test('typical title stays under 600px', () => {
    const title = 'Best SEO Tools 2026 - Free Checker';
    const width = estimatePixelWidth(title);
    expect(width).toBeLessThan(600);
    expect(width).toBeGreaterThan(100);
  });

  test('very long title exceeds 580px', () => {
    const longTitle = 'This is a very long page title that should definitely exceed the Google SERP pixel width limit and be truncated';
    const width = estimatePixelWidth(longTitle);
    expect(width).toBeGreaterThan(580);
  });
});
