import { useEffect, useState } from "react";
import UploadForm from "../components/FileUpload";

export default function Dashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/queue-status");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Log Processing Stats</h2>

            {/* File Upload Section */}
            <UploadForm />

            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">File Name</th>
                        <th className="border p-2">Error Count</th>
                        <th className="border p-2">Processed At</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center p-4">
                                No logs processed yet.
                            </td>
                        </tr>
                    ) : (
                        stats.map((stat) => (
                            <tr key={stat.id} className="border-b">
                                <td className="border p-2">{stat.file_name}</td>
                                <td className="border p-2">{stat.error_count}</td>
                                <td className="border p-2">{new Date(stat.created_at).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
