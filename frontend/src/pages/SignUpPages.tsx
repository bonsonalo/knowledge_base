import { useEffect, useState } from "react";
import { useAuth } from "../state/hook";
import { Link, useNavigate } from "react-router-dom";
import { Diamond, Eye, MoveRight } from 'lucide-react'
import { EyeOff } from 'lucide-react';
import api from "../utils/api";

export function SignUpPage() {

    const [firstName, setFirstName]= useState("");
    const [lastName, setLastName]= useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [error, setError] = useState("");


    const { status, isAuthenticated, login} = useAuth();
    const navigate= useNavigate();

    const [hideMode, setHideMode] = useState(true)



    useEffect(() => {
        if (isAuthenticated && status== 'succeeded') {
            navigate('/')
        }
    }, [isAuthenticated, status, navigate])

    const handleSubmit= async () => {
        try{
            await api.post("/api/v1/auth/signup", {first_name: firstName, last_name: lastName, email, password});
            await login(email, password);
            navigate('/')

        }   
        catch(_error){
            setError("Sign Up failed")
        }
    }

    return (
        <div className="bg-[#F9FAFA] h-screen">
            <div className="flex flex-col h-full items-center justify-center w-80 mx-auto my-auto lg:w-4/12">
                <div 
                    className="flex flex-col w-full px-5 py-6 lg:px-10 lg:pt-10 rounded-lg shadow-lg mb-5"
                    style={{border: ".3px solid #cfcfcf", backgroundColor: "#FFFFFF"}}
                    >                    
                    <div className="flex gap-2 justify-center">
                            <div style={{backgroundColor: "#3899FA", padding: "3px", borderRadius: "6px"}} className="h-fit">
                                <Diamond color="white" size={24}/>
                            </div>
                            <div className="items-center flex font-bold justify-between text-2xl mb-2" style={{color: "#3899FA"}}>
                                Knowledge Base
                            </div>
                    </div>
                    <div className="font-bold text-xl mb-2 flex justify-center">Create your account</div>
                    <div className="text-center opacity-90 mb-6">Start your journey into the world's most comprehensive knowledge platform.</div>
                    <div className="lg:flex lg:gap-3 lg:justify-between">
                        <div className="flex flex-col gap-2 mb-5">
                            <div 
                                className="font-base opacity-80 text-base"
                                style={{fontWeight: "500"}}
                            >
                                First Name
                            </div>
                            <input 
                                type="text" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder=' First Name'
                                className="px-2 w-full h-8 focus:outline-none shadow-sm rounded-lg"
                                style={{ border: ".3px solid #cfcfcf"}}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-5">
                            <div 
                                className="font-base opacity-80 text-base"
                                style={{fontWeight: "500"}}
                            >
                                Last Name
                            </div>
                            <input 
                                type="text" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder='last Name'
                                className="px-2 w-full h-8 focus:outline-none shadow-sm rounded-lg"
                                style={{ border: ".3px solid #cfcfcf"}}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                        <div 
                            className="font-base opacity-80 text-base"
                            style={{fontWeight: "500"}}
                        >
                            Email Address
                        </div>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='name@company.com'
                            className="px-2 w-full h-8 focus:outline-none shadow-sm rounded-lg"
                            style={{ border: ".3px solid #cfcfcf"}}
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative mb-5">
                        <div className="flex justify-between">
                            <div 
                                className="font-base opacity-80 text-base"
                                style={{fontWeight: "500"}}
                            >
                                    Password</div>
                            <Link to= "#" className="text-[#3899FA] text-sm">Forgot password?</Link>
                        </div>
                        <div>
                            <input 
                                type= {hideMode ? "password" : "text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-2 w-full h-8 focus:outline-none shadow-sm rounded-lg items-center"
                                style={{border: ".3px solid #cfcfcf"}}
                                placeholder="**********"
                            />
                            <div className="absolute bottom-1 right-2 cursor-pointer" onClick={() => setHideMode(!hideMode)}>
                                {hideMode ? < Eye /> : < EyeOff />}
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex gap-2 mb-6 lg:gap-3">
                        <input type="checkbox" className="scale-130 cursor-pointer"/>
                        <div className="text-sm" style={{fontWeight: "200"}}>By creating an account, you agree to our <Link to={"#"} className="text-[#3899FA]"> Terms of Service </Link> and <Link to={"#"} className="text-[#3899FA]"> Privacy Policy </Link>.</div>
                    </div>
                    <div className="flex gap-2 justify-center bg-[#3899FA] mb-5 py-2 rounded-md text-sm hover:cursor-pointer"  onClick={handleSubmit}>
                        <button className="text-[#fff]">
                            Sign in
                        </button>
                        <MoveRight color="white"/>
                    </div>
                    <div 
                        className="-mx-5 border-4 border-gray-400 mb-4"
                        style={{border:".3px solid #cfcfcf"}}
                    >

                    </div>
                    <div className="w-full text-sm mb-2">
                        You already have an account? <Link to={"/login"} className="text-[#3899FA] font-semibold text-sm">Log in</Link>
                    </div>

                </div>

                <div className="text-gray-400 text-sm mb-2 text-center flex">© 2026 Knowledge Base. Trusted by 5,000+ contributors worldwide.</div>
                <div className="flex justify-center text-sm gap-2 lg:gap-3 text-gray-400">
                    <Link to={"#"} className="hover:brightness-50">Privacy Policy</Link>
                    <Link to={"#"} className="hover:brightness-50">Terms of Service</Link>
                    <Link to={"#"} className="hover:brightness-50">Help Center</Link>
                </div>
            </div>
        </div>
        
    )
}
