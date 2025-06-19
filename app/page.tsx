"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  owner: {
    id: string;
    name?: string;
    email: string;
  };
}

export default function Home() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line
  }, []);

  async function fetchVideos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/video");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : [data]);
    } catch (err: unknown) {
      let message = "Could not load videos.";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', marginBottom: 20}}>
        <h1><span style={{color: '#0070f3', fontWeight: 800}}>Vilog</span></h1>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          {session ? (
            <Link 
              href="/dashboard"
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              href="/login"
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Login to Upload
            </Link>
          )}
        </div>
      </div>

      <div style={{margin: '32px 0', padding: '16px', background: '#f0f0f0', borderRadius: 8, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto'}}>
        <p style={{margin: 0, color: '#666'}}>
          👋 Welcome to Vilog! {!session && 'Login to upload your own videos.'}
        </p>
      </div>

      <h2 style={{marginTop: 32}}>Latest Videos</h2>
      {loading && <div>Loading videos...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24}}>
        {videos.length === 0 && !loading && <div>No videos found.</div>}
        {videos.map((vid) => (
          <div key={vid._id} style={{border: '1px solid #eee', borderRadius: 8, padding: 16, width: 300, background: '#fafbfc'}}>
            {vid.thumbnailUrl && (
              <Image
                src={vid.thumbnailUrl}
                alt={vid.title}
                width={300}
                height={170}
                style={{ width: '100%', borderRadius: 6, marginBottom: 8, height: 'auto' }}
              />
            )}
            <h3 style={{margin: '8px 0', color: '#000', fontWeight: 700}}>{vid.title}</h3>
            <p style={{fontSize: 14, color: '#000'}}>{vid.description}</p>
            <div style={{marginTop: 8, marginBottom: 12, fontSize: 14, color: '#666'}}>
              Uploaded by: {vid.owner?.name || vid.owner?.email || 'Unknown'}
            </div>
            <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer" style={{color: '#0070f3', textDecoration: 'underline'}}>Watch Video</a>
          </div>
        ))}
      </div>
    </div>
  );
}
