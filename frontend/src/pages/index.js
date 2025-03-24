import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FileUpload from "../components/FileUpload";
import supabase from "../config/supabaseClient";

export default function Dashboard() {
    // Removed duplicate declaration of stats
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push("/auth");  // 🔄 Redirect to login if not authenticated
            } else {
                setUser(data.user);
            }
        }
        checkUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetch(`/api/stats`)
                .then((res) => res.json())
                .then((data) => setStats(Array.isArray(data) ? data : [])) // Ensure it's an array
                .catch((error) => console.error("Error fetching stats:", error));
        }
    }, [user]);

    useEffect(() => {
        const socket = new WebSocket("ws://log-analytics-backend.onrender.com/api/live-stats");
        socket.onmessage = event => setStats(JSON.parse(event.data));
        return () => socket.close();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Log Processor Dashboard</h1>
            <p>Welcome, {user.email}</p>
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
