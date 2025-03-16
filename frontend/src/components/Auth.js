import { useState } from "react";
import supabase from "../config/supabaseClient";  // ✅ Use the imported Supabase client

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            localStorage.setItem("supabaseToken", data.session.access_token);
            supabase.auth.setSession(data.session);
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
