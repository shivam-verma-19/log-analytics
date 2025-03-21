'use client';

import { useEffect, useState } from 'react';
import supabase from "../config/supabaseClient";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [stats, setStats] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login'); // Redirect to login if no session
                return;
            }

            fetchStats(); // Fetch logs only after verifying auth
        }

        checkAuth();

        fetchStats(token);
        const ws = new WebSocket('wss://log-analytics-backend.onrender.com/api/live-stats'); // Adjust WebSocket URL
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStats((prev) => [data, ...prev]); // Update with real-time data
        };

        return () => ws.close();
    }, []);

    async function fetchStats() {
        const { data, error } = await supabase.from('log_stats').select('*');
        if (error) console.error('Error fetching stats:', error);
        else setStats(data);
    }

    async function handleFileUpload() {
        if (!file) return;
        setUploading(true);

        const filePath = `logs/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage.from('logs').upload(filePath, file, {
            cacheControl: '3600',
            upsert: false // Prevent overwriting
        });
        if (error) console.error('Upload error:', error);
        else alert('File uploaded successfully!');

        setUploading(false);
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Log Dashboard</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
            <button onClick={handleFileUpload} disabled={uploading} className="bg-blue-500 text-white p-2 mb-4">
                {uploading ? 'Uploading...' : 'Upload Log File'}
            </button>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">Job ID</th>
                        <th className="p-2">Error Count</th>
                        <th className="p-2">Keyword Count</th>
                        <th className="p-2">Unique IPs</th>
                        <th className="p-2">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(stats) && stats.length > 0 ? (
                        stats.map((stat) => (
                            <tr key={stat.id} className="border-t">
                                <td className="p-2">{stat.job_id}</td>
                                <td className="p-2">{stat.error_count}</td>
                                <td className="p-2">{JSON.stringify(stat.keyword_count)}</td>
                                <td className="p-2">{JSON.stringify(stat.unique_ips)}</td>
                                <td className="p-2">{new Date(stat.created_at).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="p-2 text-center">No data available</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
