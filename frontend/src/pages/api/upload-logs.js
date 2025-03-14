import multer from "multer";
import { logQueue } from "../../../backend/queues/logQueue";

const upload = multer({ dest: "uploads/" });

export default async function handler(req, res) {
    if (req.method === "POST") {
        upload.single("file")(req, res, async function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const job = await logQueue.add("process-log", {
                filePath: req.file.path,
            });

            return res.status(200).json({ jobId: job.id });
        });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
