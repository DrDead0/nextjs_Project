"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Access denied. Please <Link href="/login">login</Link>.</div>;

  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h1><span style={{color: '#0070f3', fontWeight: 800}}>Vilog</span> Profile</h1>
      <p><strong>ID:</strong> {session.user?.id}</p>
      <p><strong>Email:</strong> {session.user?.email}</p>
      <Link href="/dashboard">Back to Dashboard</Link>
    </div>
  );
} 