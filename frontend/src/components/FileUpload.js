import { useState } from 'react';
import supabase from "../config/supabaseClient";

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // ✅ Ensure Supabase token exists
        const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token);
        if (!token) {
            alert("User is not authenticated. Please log in again.");
            return;
        }

        console.log("🔑 Supabase Token:", token);
        console.log("📡 Uploading to:", `/api/upload`);

        try {
            const res = await fetch(`/api/upload-logs`, {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // ✅ Check if the response is successful
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
            }

            const data = await res.json();

            if (!data.jobId) throw new Error("Job ID is missing from response");

            alert(`✅ Job submitted! Job ID: ${data.jobId}`);
        } catch (error) {
            console.error("❌ Upload failed:", error);
            setError(error.message);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload Log</button>
            {error && <p className="text-red-500">❌ {error}</p>}
        </div>
    );
}
