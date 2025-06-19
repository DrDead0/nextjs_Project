import Link from 'next/link';

export default function Home() {
  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h1>Welcome to <span style={{color: '#0070f3', fontWeight: 800}}>Vilog</span>!</h1>
      <p>This is the public home page.</p>
      <div style={{marginTop: 24}}>
        <Link href="/login" style={{marginRight: 16}}>Login</Link>
        <Link href="/register" style={{marginRight: 16}}>Register</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
