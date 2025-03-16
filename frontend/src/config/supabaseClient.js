import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,  // Use frontend env variables
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // Use anon key for frontend
);

export default supabase;
