import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,  // Use backend env variables
    process.env.SUPABASE_SERVICE_ROLE_KEY  // Use the service role key for full DB access
);

export default supabase;
