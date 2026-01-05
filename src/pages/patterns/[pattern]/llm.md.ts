import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';

const patterns = [
  'accordion',
  'alert',
  'breadcrumb',
  'button',
  'checkbox',
  'dialog',
  'disclosure',
  'listbox',
  'menu-button',
  'switch',
  'tabs',
  'toolbar',
  'tooltip',
];

export const getStaticPaths: GetStaticPaths = () => {
  return patterns.map((pattern) => ({
    params: { pattern },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const { pattern } = params;

  try {
    const filePath = join(process.cwd(), 'src', 'patterns', pattern!, 'llm.md');
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
