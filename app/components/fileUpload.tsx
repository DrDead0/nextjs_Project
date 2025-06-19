"use client" 

import {
    upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadResponse {
    url?: string;
    fileId?: string;
    name?: string;
    size?: number;
    filePath?: string;
    thumbnailUrl?: string;
}

interface FileUploadProps {
    onSuccess: (res: FileUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({onSuccess,onProgress,fileType}:FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File) => {
        if (fileType == "video") {
            if (!file.type.startsWith("video/")) {
                setError("Invalid file type...! Please upload a video file.");
                setSuccess(null);
                return false;
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size exceeds 100MB limit. Please upload a smaller file.");
            setSuccess(null);
            return false;
        }
        setError(null);
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) {
            setSelectedFile(null);
            setSuccess(null);
            return;
        }
        setSelectedFile(file);
        setError(null);
        setSuccess(null);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setProgress(0);
        setError(null);
        setSuccess(null);
        try {
            const authRes = await fetch("/api/imageKit-auth");
            const auth = await authRes.json();
            const res = await upload({
                file: selectedFile,
                fileName: selectedFile.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100;
                        setProgress(Math.round(percent));
                        onProgress?.(Math.round(percent));
                    }
                },
            });
            onSuccess(res);
            setSuccess("Upload successful!");
            setSelectedFile(null);
        } catch (error) {
            setError("Upload failed. Please try again.");
            setSuccess(null);
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // const [progress, setProgress] = useState(0);
    // const fileInputRef = useRef<HTMLInputElement>(null);
    // const abortController = new AbortController();

    // const authenticator = async () => {
    //     try {

    //         const response = await fetch("/api/upload-auth");
    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    //         }
    //         const data = await response.json();
    //         const { signature, expire, token, publicKey } = data;
    //         return { signature, expire, token, publicKey };
    //     } catch (error) {
    //         console.error("Authentication error:", error);
    //         throw new Error("Authentication request failed");
    //     }
    // };
    // const handleUpload = async () => {
    //     const fileInput = fileInputRef.current;
    //     if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    //         alert("Please select a file to upload");
    //         return;
    //     }

    //     const file = fileInput.files[0];

    //     let authParams;
    //     try {
    //         authParams = await authenticator();
    //     } catch (authError) {
    //         console.error("Failed to authenticate for upload:", authError);
    //         return;
    //     }
    //     const { signature, expire, token, publicKey } = authParams;
    //     try {
    //         const uploadResponse = await upload({
    //             expire,
    //             token,
    //             signature,
    //             publicKey,
    //             file,
    //             fileName: file.name, 
    //             onProgress: (event) => {
    //                 setProgress((event.loaded / event.total) * 100);
    //             },
    //             abortSignal: abortController.signal,
    //         });
    //         console.log("Upload response:", uploadResponse);
    //     } catch (error) {
    //         if (error instanceof ImageKitAbortError) {
    //             console.error("Upload aborted:", error.reason);
    //         } else if (error instanceof ImageKitInvalidRequestError) {
    //             console.error("Invalid request:", error.message);
    //         } else if (error instanceof ImageKitUploadNetworkError) {
    //             console.error("Network error:", error.message);
    //         } else if (error instanceof ImageKitServerError) {
    //             console.error("Server error:", error.message);
    //         } else {
    //             console.error("Upload error:", error);
    //         }
    //     }
    // };

    return (
        <>
            <input
                type="file"
                aria-label="File upload"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                disabled={uploading}
            />
            {selectedFile && !uploading && (
                <>
                    <div style={{ marginTop: 8, color: '#333' }}>
                        Selected file: {selectedFile.name}
                    </div>
                    <button type="button" aria-label="Upload file" onClick={handleUpload} style={{ marginLeft: 8 }}>
                        Upload
                    </button>
                </>
            )}
            {uploading && (
                <>
                    <span>Uploading... {progress}%</span>
                    <div style={{ width: '100%', background: '#eee', borderRadius: 4, margin: '8px 0' }}>
                        <div style={{ width: `${progress}%`, height: 8, background: '#0070f3', borderRadius: 4, transition: 'width 0.2s' }} />
                    </div>
                </>
            )}
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
            <br />
        </>
    );
}

export default FileUpload;