"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        setLoading(false);
        if (result?.error) {
            setError("Invalid email or password");
        } else {
            router.push('/');
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signIn('google', { callbackUrl: '/' });
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontWeight: 800, fontSize: 36, marginBottom: 24, color: '#222', letterSpacing: 1 }}>Login</h1>
            <div style={{ width: 370, padding: 32, borderRadius: 14, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 18, color: '#222' }}>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        padding: 12,
                        borderRadius: 6,
                        background: '#fff',
                        color: '#222',
                        border: '1.5px solid #4285F4',
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48" style={{ display: 'inline', verticalAlign: 'middle' }}><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.69 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.13 13.99 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28c-1.01-2.99-1.01-6.19 0-9.18l-7.98-6.19C.64 16.09 0 19.01 0 22c0 2.99.64 5.91 1.77 8.63l7.98-6.19z"/><path fill="#EA4335" d="M24 44c6.18 0 11.36-2.05 15.14-5.59l-7.19-5.59c-2.01 1.35-4.58 2.16-7.95 2.16-6.43 0-11.87-4.49-13.33-10.48l-7.98 6.19C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                    <span>Sign in with Google</span>
                </button>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: 10, borderRadius: 6, border: '1px solid #d1d5db', outline: 'none', fontSize: 16, transition: 'border 0.2s', boxSizing: 'border-box', color: '#222', background: '#fafbfc' }}
                        onFocus={e => e.currentTarget.style.border = '#0070f3 1.5px solid'}
                        onBlur={e => e.currentTarget.style.border = '#d1d5db 1px solid'}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: 10, borderRadius: 6, border: '1px solid #d1d5db', outline: 'none', fontSize: 16, transition: 'border 0.2s', boxSizing: 'border-box', color: '#222', background: '#fafbfc' }}
                        onFocus={e => e.currentTarget.style.border = '#0070f3 1.5px solid'}
                        onBlur={e => e.currentTarget.style.border = '#d1d5db 1px solid'}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: 12, borderRadius: 6, background: loading ? '#b2cdfa' : '#0070f3', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && <div style={{ color: "#b00020", textAlign: "center", fontSize: 15 }}>{error}</div>}
                </form>
                <div style={{ textAlign: "center", fontSize: 15, marginTop: 8 }}>
                    <span>Don&apos;t have an account? <Link href="/register" style={{ color: '#0070f3', textDecoration: 'underline' }}>Register</Link></span><br />
                    <span>Go back to <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>Home</Link></span>
                </div>
            </div>
        </div>
    );
}

export default Login;