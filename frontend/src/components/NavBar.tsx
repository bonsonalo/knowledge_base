import { useAuth } from "../state/hook"
import { CircleUserRound, Loader } from "lucide-react";
import { Diamond, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { Notification } from "../types";

export function NavBar() {
    const { currentUser, status } = useAuth();
    const navigate= useNavigate();
    const [notifications, setNotifications]= useState(0);



    useEffect(() => {
        if (currentUser) {
            const fetchNotifications = () =>{
                api.get("/api/v1/notification").then(response => {
                    const unreadCount= response.data.filter((n: Notification) => !n.is_read).length;
                    setNotifications(unreadCount);
                })
                .catch(() => setNotifications(0));
            }
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval)
        }
        
    }, [currentUser])
    return (
        <>
            <nav className="flex mx-auto justify-between mt-4 items-center w-11/12 lg:lg:w-10/12">
                <div className="flex gap-1">
                    <div style={{backgroundColor: "#3899FA", padding: "4px", borderRadius: "6px"}} className="h-fit">
                        <Diamond color="white" size={26}/>
                    </div>
                    <div className="text-sm items-center flex justify-between">Knowledge Base</div>
                </div>
                <div>
                    {status === "loading" ? < Loader />: currentUser ? 
                    <div className="flex relative gap-4">
                        <Bell size={23}/>
                        <div className="absolute top-2 left-3 bg-[#3899FA] rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                            <span className="text-white text-xs leading-none">{notifications}</span>
                        </div>
                        {currentUser.avatar? <img src={currentUser.avatar}/> : <Link to={"#"}><CircleUserRound size={23}/></Link>}
                    </div> : 
                    <div className="text-sm border p-1 rounded-lg cursor-pointer" style={{color: "#5A5F68"}} onClick={() => navigate("/login")}>
                        Login/Signup
                    </div>
                    }
                </div>
            </nav>
            <div className="border-solid border-gray-300 border shadow-xl mt-2"></div>
        
        </>
    )
}