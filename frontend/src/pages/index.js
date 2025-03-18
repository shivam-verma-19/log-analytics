import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FileUpload from "../components/FileUpload";
import supabase from "../config/supabaseClient";

export default function Dashboard() {
    const [stats, setStats] = useState([]);
    const [user, setUser] = useState(null);
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
                .then(setStats)
                .catch((error) => console.error("Error fetching stats:", error));
        }
    }, [user]);

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
