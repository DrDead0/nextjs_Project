import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        
        console.log('[API/VIDEO/GET] Request params:', { email });

        await dbConnect();
        
        let query = {};
        if (email) {
            query = { 'owner.email': email };
            console.log('[API/VIDEO/GET] Filtering by email:', email);
        }

        const videos = await Video.find(query).sort({ createdAt: -1 });
        console.log(`[API/VIDEO/GET] Found ${videos.length} videos for query:`, query);
        
        return NextResponse.json(videos);
    } catch (error) {
        console.error('[API/VIDEO/GET] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            console.log('[API/VIDEO/POST] Unauthorized - no session or email');
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        console.log('[API/VIDEO/POST] Received body:', body);

        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            console.log('[API/VIDEO/POST] Missing required fields');
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const videoData = {
            ...body,
            owner: {
                id: session.user.id || 'unknown',
                name: body.owner?.name || session.user.name || 'Anonymous',
                email: session.user.email // This is guaranteed to exist from the check above
            }
        };

        console.log('[API/VIDEO/POST] Saving video with data:', videoData);

        const video = new Video(videoData);
        await video.save();

        console.log('[API/VIDEO/POST] Video saved successfully:', video._id);
        
        return NextResponse.json(video);
    } catch (error) {
        console.error('[API/VIDEO/POST] Error:', error);
        return NextResponse.json(
            { error: 'Failed to create video' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('id');
        
        if (!videoId) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        await dbConnect();
        
        // Find the video and check if it belongs to the user
        const video = await Video.findById(videoId);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        
        if (video.owner.email !== session.user.email) {
            return NextResponse.json({ error: "You can only delete your own videos" }, { status: 403 });
        }

        // Delete the video
        await Video.findByIdAndDelete(videoId);
        
        console.log('[API/VIDEO/DELETE] Video deleted successfully:', videoId);
        
        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error('[API/VIDEO/DELETE] Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    }
}