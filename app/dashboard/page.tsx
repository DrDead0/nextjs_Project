"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FileUpload from "../components/fileUpload";
import Image from "next/image";

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Upload form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, videoUrl, thumbnailUrl }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to upload video");
      setSuccess("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setShowForm(false);
      fetchVideos();
    } catch (err: unknown) {
      let message = "Failed to upload video";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Access denied. Please <Link href="/login">login</Link>.</div>;

  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h1><span style={{color: '#0070f3', fontWeight: 800}}>Vilog</span> Dashboard</h1>
      <p>Welcome, {session.user?.email || 'User'}!</p>
      <Link href="/profile">Go to Profile</Link>
      <div style={{margin: '32px 0'}}>
        <button onClick={() => setShowForm(f => !f)} style={{padding: '8px 20px', borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>
          {showForm ? 'Cancel' : 'Upload Video'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} style={{margin: '0 auto 32px', maxWidth: 400, background: '#fafbfc', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', textAlign: 'left'}}>
          <h2 style={{textAlign: 'center', color: '#000'}}>Upload Video</h2>
          <label style={{color: '#000'}}>Title:<br/>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', color: '#000'}} />
          </label>
          <label style={{color: '#000'}}>Description:<br/>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', color: '#000'}} />
          </label>
          <label style={{color: '#000'}}>Video File:<br/>
            <FileUpload fileType="video" onSuccess={(res: any) => setVideoUrl(res.url)} />
          </label>
          <label style={{color: '#000'}}>Thumbnail Image:<br/>
            <FileUpload fileType="image" onSuccess={(res: any) => setThumbnailUrl(res.url)} />
          </label>
          <button type="submit" disabled={uploading || !videoUrl || !thumbnailUrl} style={{marginTop: 16, width: '100%', padding: 10, borderRadius: 4, background: uploading ? '#b2cdfa' : '#0070f3', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: uploading ? 'not-allowed' : 'pointer'}}>
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
        </form>
      )}
      <h2 style={{marginTop: 32}}>Videos</h2>
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
            <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer" style={{color: '#0070f3', textDecoration: 'underline'}}>Watch Video</a>
          </div>
        ))}
      </div>
    </div>
  );
} 