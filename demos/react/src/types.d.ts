// CSS Modules type declarations
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// Vite environment variables
interface ImportMetaEnv {
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}