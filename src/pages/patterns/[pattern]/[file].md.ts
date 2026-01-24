import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getPatterns } from '@/lib/patterns';

// Get pattern IDs from the centralized patterns definition
const patterns = getPatterns().map((p) => p.id);

export const getStaticPaths: GetStaticPaths = () => {
  // Generate paths where file equals pattern name (e.g., /patterns/accordion/accordion.md)
  return patterns.map((pattern) => ({
    params: { pattern, file: pattern },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const { pattern, file } = params;

  // Only serve if file matches pattern name
  if (file !== pattern) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), 'src', 'patterns', pattern!, `${pattern}.md`);
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
