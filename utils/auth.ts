import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
// import TwitterProvider from "next-auth/providers/twitter"
// import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs"; 

export const authOptions: NextAuthOptions= {
    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
        }),
        //Credential login
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    console.log("Missing credentials");
                    throw new Error("Email and Password is required...!")
                }
                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        console.log("No user found with email:", credentials.email);
                        throw new Error("No user found");
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValid) {
                        console.log("Invalid password for user:", credentials.email);
                        throw new Error("invalid password");
                    }
                    // console.log("User authenticated successfully:", credentials.email);
                    return{
                        id:user._id.toString(),
                        email:user.email,
                    }
                }catch (error) {
                    console.error("Error in Authorizing User:", error)
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error("Invalid credentials");
                }
            }
          })

      ],
      callbacks:{
        async jwt({token,user}){
            if(user){
                token.id =user.id;
            }
            return token;
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string;
            }
            return session;
        }
      },
      pages:{
        signIn: "/login",
        error: "/login"
      },
      session:{
        strategy:"jwt",
        maxAge: 30* 24 * 60 * 60, 
        
      },
      secret: process.env.NEXTAUTH_SECRET
};