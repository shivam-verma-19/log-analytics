import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

export function useLiveStats() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        socket.on("update", (data) => {
            setStats((prevStats) => [...prevStats, data]);
        });

        return () => {
            socket.off("update");
        };
    }, []);

    return stats;
}
