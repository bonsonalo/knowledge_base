import { useEffect, useState } from "react";
import { useAuth } from "../state/hook";
import { Link, useNavigate } from "react-router-dom";
import { Diamond, Eye, MoveRight } from 'lucide-react'
import { EyeOff } from 'lucide-react';

export function LoginPage() {

    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");


    const { status, isAuthenticated, login} = useAuth();
    const navigate= useNavigate();

    const [hideMode, setHideMode] = useState(true)



    useEffect(() => {
        if (isAuthenticated && status== 'succeeded') {
            navigate('/articles')
        }
    }, [isAuthenticated, status, navigate])

    const handleSubmit= async () => {
        await login(email, password);
    }

    return (
        <div className="bg-[#F9FAFA] h-screen">
            <div className="flex flex-col h-full justify-center w-80 mx-auto lg:w-3/12">
                <div className="flex gap-2 justify-center">
                        <div style={{backgroundColor: "#3899FA", padding: "3px", borderRadius: "6px"}} className="h-fit">
                            <Diamond color="white" size={24}/>
                        </div>
                        <div className="items-center flex font-bold justify-between text-2xl mb-2" style={{color: "#3899FA"}}>
                            Knowledge Base
                        </div>
                </div>
                <div className="font-bold text-xl mb-2 flex justify-center">Welcome Back</div>
                <div className="text-center opacity-90 mb-6">Access your professional knowledge library</div>
                <div 
                    className="flex flex-col w-full px-5 rounded-lg shadow-lg mb-9"
                    style={{border: ".3px solid #cfcfcf", backgroundColor: "#FFFFFF"}}
                    >                    
                    <div className="mr-auto text-xl opacity-80 font-semibold pt-6">Sign In</div>
                    <div className="text-sm font-normal opacity-80 mt-2 mb-4">Enter your credentials to manage and read articles</div>
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
                    <div className="flex gap-2 mb-6">
                        <input type="checkbox" className="scale-110"/>
                        <div className="text-sm" style={{fontWeight: "500"}}>Remember me for 30 days</div>
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
                    <div className="w-full text-sm mb-6">
                        Don't have an account? <Link to={"/signup"} className="text-[#3899FA] font-semibold text-sm">Create an account</Link>
                    </div>

                </div>

                <div className="text-gray-400 text-sm mb-3 text-center flex">© 2026 Knowledge Base. Trusted by 5,000+ contributors worldwide.</div>
                <div className="flex justify-center text-sm gap-2 text-gray-400">
                    <div>Privacy Policy</div>
                    <div>Terms of Service</div>
                    <div>Help Center</div>
                </div>
            </div>
        </div>
        
    )
}
