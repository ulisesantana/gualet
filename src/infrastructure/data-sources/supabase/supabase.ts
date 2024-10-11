import { createClient } from "@supabase/supabase-js";

import { Database } from "./supabase.database.types";

export const supabase = createClient<Database>(
  // @ts-ignore
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  // @ts-ignore
  import.meta.env.VITE_SUPABASE_API_KEY,
);
