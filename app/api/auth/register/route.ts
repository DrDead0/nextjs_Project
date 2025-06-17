import { NextRequest , NextResponse} from "next/server";
import { dbConnect } from "@/utils/db";
import User from "@/models/user";

export async function POST(request: NextRequest){
    try {
        const {email,password} =await request.json()
        if(!email || !password){
            return NextResponse.json({error:"Email and password is Required"},{status:400})
        }
        await dbConnect();
        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error:"User already exists"},{status:400})
        }
        await User.create({email,password})
        return NextResponse.json({message:"User created Successfully"},{status:201})
    } catch (error){
        console.error("Error in Registering User:", error);
        return NextResponse.json({error:"Failed to Register User"},{status:500})
    }
}