import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useRouter } from "next/router";
import crypto from "crypto";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null); // Track session state

    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };

        checkSession();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        let logoutTimer;

        const resetTimer = () => {
            clearTimeout(logoutTimer);
            logoutTimer = setTimeout(() => {
                supabase.auth.signOut();
                localStorage.removeItem("supabaseToken"); // ✅ Clear session
                // Decrypt token if needed in future logic
                router.push("/auth"); // ✅ Redirect to login
            }, 5 * 60 * 1000); // 5 minutes
        };

        if (session) {
            resetTimer();
            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keydown", resetTimer);
        }

        return () => {
            clearTimeout(logoutTimer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
        };
    }, [session]);

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) setError(error.message);
        else alert("Check your email for a confirmation link!");

        setLoading(false);
    };

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        } else {
            alert("Signed in successfully!");
            const encryptedToken = encrypt(data.session.access_token);
            localStorage.setItem("supabaseToken", encryptedToken);
            supabase.auth.setSession(data.session);
            router.push("/"); // Redirect to Dashboard
        }

        setLoading(false);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Login / Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full my-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full my-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 w-full my-2" onClick={handleSignIn} disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
            </button>
            <button className="bg-green-500 text-white p-2 w-full my-2" onClick={handleSignUp} disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
            </button>
        </div>
    );
}
