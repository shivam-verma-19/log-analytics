import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";

export default function Dashboard() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stats`)
            .then((res) => res.json())
            .then(setStats)
            .catch((error) => console.error("Error fetching stats:", error));
    }, []);

    return (
        <div>
            <h1>Log Processor Dashboard</h1>
            <FileUpload />
            <ul>
                {stats.map((stat) => (
                    <li key={stat.id}>
                        {stat.file_name} - Errors: {stat.error_count}
                    </li>
                ))}
            </ul>
        </div>
    );
}
