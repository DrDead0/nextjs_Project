"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React,{useState} from 'react';

function Page(){
    const [email,setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Passwords do not match");
            return;
        };

       try {
        //react-query
        //loading,error,debounce,mutation

        const res = await fetch('/api/auth/register',{method: "POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({email,password})});
        const data = await res.json();
        if(res.ok){
            throw new Error(data.error || "Something went wrong..!");
        }
        console.log("Registration successful", data);
        // alert("Registration successful, please login");
        router.push('/login');
       } catch (error) {
        console.error(error);
        // alert("Registration failed, please try again");
       }
    }





    return(
        <div>
         <h1>Register</h1>
         <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            <button type="submit">Register</button>
            <p>Already have an account? <Link href="/login">Login</Link></p>
            <p>Go back to <Link href="/">Home</Link></p>
         </form>
        </div>
    )
}
export default Page;