import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between p-4 bg-gray-800 text-white">
            <Link href="/">Home</Link>
            <Link href="/auth">Sign In</Link>  {/* ✅ Ensure navigation to Auth */}
        </nav>
    );
}
