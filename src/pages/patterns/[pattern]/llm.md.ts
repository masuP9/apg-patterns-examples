import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getAvailablePatterns } from '@/lib/patterns';

// Get pattern IDs from the centralized patterns definition
const patterns = getAvailablePatterns().map((p) => p.id);

export const getStaticPaths: GetStaticPaths = () => {
  return patterns.map((pattern) => ({
    params: { pattern },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const { pattern } = params;

  try {
    // Note: tree-view uses 'treeview' as directory name in src/patterns/
    const filePattern = pattern === 'tree-view' ? 'treeview' : pattern;
    const filePath = join(process.cwd(), 'src', 'patterns', filePattern!, 'llm.md');
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
