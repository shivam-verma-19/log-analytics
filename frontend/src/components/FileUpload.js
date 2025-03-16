import { useState } from 'react';

export default function UploadForm() {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('supabaseToken');
        console.log("Supabase Token:", token);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}` // Attach token
            }
        });

        const data = await res.json();
        alert(`Job submitted! Job ID: ${data.jobId}`);
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload Log</button>
        </div>
    );
}
