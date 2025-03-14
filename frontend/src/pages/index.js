import { useEffect, useState } from "react";

export default function Dashboard() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then(setStats);
    }, []);

    return (
        <div>
            <h1>Log Processor Dashboard</h1>
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
