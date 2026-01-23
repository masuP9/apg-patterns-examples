import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getAvailablePatterns } from '@/lib/patterns';

// Get pattern IDs from the centralized patterns definition
const patterns = getAvailablePatterns().map((p) => p.id);

export const getStaticPaths: GetStaticPaths = () => {
  // Generate paths where file equals {pattern}.ja (e.g., /ja/patterns/accordion/accordion.ja.md)
  return patterns.map((pattern) => ({
    params: { pattern, file: `${pattern}.ja` },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const { pattern, file } = params;

  // Only serve if file matches {pattern}.ja
  if (file !== `${pattern}.ja`) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), 'src', 'patterns', pattern!, `${pattern}.ja.md`);
    const content = await readFile(filePath, 'utf-8');

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
