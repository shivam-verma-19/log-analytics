import formidable from "formidable";
import supabase from "../../config/supabaseClient";
import queue from "../../../../backend/queues/logQueue";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = "/tmp";
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Error parsing form:", err);
            return res.status(500).json({ error: "File upload failed" });
        }

        const file = files.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        try {
            const { data, error } = await supabase.storage
                .from("log-files")
                .upload(`logs/${file.newFilename}`, file.filepath, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const filePath = data?.path;
            console.log("✅ File uploaded to Supabase:", filePath);

            await queue.add("process-log", { filePath });

            return res.status(200).json({ message: "File uploaded successfully", filePath });
        } catch (uploadError) {
            console.error("Upload Error:", uploadError);
            return res.status(500).json({ error: "Internal Server Error during file upload" });
        }
    });
}
