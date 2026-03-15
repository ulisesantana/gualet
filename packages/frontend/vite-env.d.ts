/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_URL: string;
  readonly VITE_SUPABASE_API_KEY: string;
  readonly BASE_URL: string;
  // add other variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
