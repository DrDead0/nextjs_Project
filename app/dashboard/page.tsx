"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import FileUpload from "../components/fileUpload";
import Image from "next/image";

interface FileUploadResponse {
  url?: string;
  fileId?: string;
  name?: string;
  size?: number;
  filePath?: string;
  thumbnailUrl?: string;
}

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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [ownerName, setOwnerName] = useState(session?.user?.name || "");
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchUserVideos = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    setError(null);
    try {
      // Add timestamp to prevent caching
      const res = await fetch("/api/video?email=" + encodeURIComponent(session.user.email) + "&t=" + Date.now());
      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await res.json();
      console.log("Fetched videos:", data); // Debug log
      setVideos(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      let message = "Could not load your videos.";
      if (err instanceof Error) message = err.message;
      setError(message);
      console.error("Error fetching videos:", err); // Debug log
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchUserVideos();
  }, [fetchUserVideos]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Access denied. Please <Link href="/login">login</Link> to upload videos.</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.email) {
      setError("You must be logged in to upload videos");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
          owner: {
            id: session.user.id,
            name: ownerName || session.user.name || "Anonymous",
            email: session.user.email
          }
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload video");
      }

      setSuccess("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setOwnerName(session.user.name || "");
      setShowUploadForm(false);
      fetchUserVideos(); // Refresh the video list
    } catch (err: unknown) {
      let message = "Failed to upload video";
      if (err instanceof Error) message = err.message;
      setError(message);
      console.error("Upload error:", err); // Debug log
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', marginBottom: 20}}>
        <h1><span style={{color: '#0070f3', fontWeight: 800}}>Vilog</span> Dashboard</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <span>Welcome, {session.user?.name || session.user?.email || 'User'}!</span>
          <Link href="/" style={{color: '#0070f3', textDecoration: 'underline'}}>View All Videos</Link>
          <Link href="/profile" style={{color: '#0070f3', textDecoration: 'underline'}}>Profile</Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{margin: '32px 0'}}>
        <button 
          onClick={() => setShowUploadForm(prev => !prev)} 
          style={{
            padding: '8px 20px', 
            borderRadius: 6, 
            background: '#0070f3', 
            color: '#fff', 
            border: 'none', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: 'pointer'
          }}
        >
          {showUploadForm ? 'Cancel Upload' : 'Upload New Video'}
        </button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleSubmit} style={{margin: '32px auto', maxWidth: 400, background: '#fafbfc', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', textAlign: 'left'}}>
          <h2 style={{textAlign: 'center', color: '#000'}}>Upload Video</h2>
          <label style={{color: '#000'}}>Your Display Name:<br/>
            <input 
              value={ownerName} 
              onChange={e => setOwnerName(e.target.value)} 
              placeholder={session.user?.name || "Enter your name"}
              style={{width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', color: '#000'}} 
            />
            <small style={{color: '#666', display: 'block', marginTop: -8, marginBottom: 12}}>
              This name will be shown as the video uploader
            </small>
          </label>
          <label style={{color: '#000'}}>Title:<br/>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', color: '#000'}} />
          </label>
          <label style={{color: '#000'}}>Description:<br/>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', color: '#000'}} />
          </label>
          <label style={{color: '#000'}}>Video File:<br/>
            <FileUpload fileType="video" onSuccess={(res: FileUploadResponse) => res.url && setVideoUrl(res.url)} />
          </label>
          <label style={{color: '#000'}}>Thumbnail Image:<br/>
            <FileUpload fileType="image" onSuccess={(res: FileUploadResponse) => res.url && setThumbnailUrl(res.url)} />
          </label>
          <button type="submit" disabled={uploading || !videoUrl || !thumbnailUrl} style={{marginTop: 16, width: '100%', padding: 10, borderRadius: 4, background: uploading ? '#b2cdfa' : '#0070f3', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: uploading ? 'not-allowed' : 'pointer'}}>
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          {success && (
            <div style={{ color: 'green', marginTop: 8 }}>
              {success} <Link href="/" style={{color: '#0070f3'}}>View all videos</Link>
            </div>
          )}
        </form>
      )}

      <div style={{marginTop: 48}}>
        <h2 style={{color: '#000'}}>Your Videos</h2>
        {loading && <div>Loading your videos...</div>}
        {error && <div style={{color: 'red'}}>{error}</div>}
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24}}>
          {videos.length === 0 && !loading && (
            <div style={{color: '#666', padding: '20px', background: '#f5f5f5', borderRadius: 8, maxWidth: 400}}>
              You haven&apos;t uploaded any videos yet. Click the &quot;Upload New Video&quot; button to get started!
            </div>
          )}
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
                Uploaded by: {vid.owner?.name || vid.owner?.email || 'Anonymous'}
              </div>
              <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer" style={{color: '#0070f3', textDecoration: 'underline'}}>Watch Video</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 