import { NextRequest , NextResponse} from "next/server";
import { dbConnect } from "@/utils/db";
import User from "@/models/user";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength validation
function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" };
  }
  return { isValid: true };
}

export async function POST(request: NextRequest){
    try {
        const {email,password} = await request.json()
        
        // Input validation
        if(!email || !password){
            return NextResponse.json({error:"Email and password are required"},{status:400})
        }

        // Email format validation
        if (!emailRegex.test(email)) {
            return NextResponse.json({error:"Invalid email format"},{status:400})
        }

        // Password strength validation
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json({error: passwordValidation.error},{status:400})
        }

        await dbConnect();
        
        // Check for existing user
        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error:"User already exists"},{status:400})
        }

        // Create user (password will be hashed by the pre-save hook)
        await User.create({email,password})
        
        return NextResponse.json({message:"User created successfully"},{status:201})
    } catch (error){
        console.error("Error in Registering User:", error);
        return NextResponse.json({error:"Failed to register user"},{status:500})
    }
}