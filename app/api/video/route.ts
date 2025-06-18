import { dbConnect } from "@/utils/db";
import video, { IVideo } from "@/models/video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function GET(){
    try{
        await dbConnect();
        const videos = await video.findOne({}).sort({createdAt: -1}).lean();
        if(!videos||videos.length===0){
            return NextResponse.json([], {status:200});
        }
        return NextResponse.json(videos);
    }catch(error){
        console.error("Failed to fetch videos:", error);
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}
export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions); 
        if(!session){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const body:IVideo = await request.json();
        if(!body.title|| !body.description||
            !body.videoUrl|| !body.thumbnailUrl){
            return NextResponse.json({error:"Missing Required Fields"}, {status: 400});
        };

        const videoData = {
            ...body,
            controllers: body?.controllers ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        };
        const newVideo = await video.create(videoData)
        return NextResponse.json(newVideo, { status: 201 });

    }catch(error){
        console.error("Failed to create video:", error);
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }
}