import { useAuth } from "../state/hook"
import { Loader } from "lucide-react";
import { Diamond, Bell } from "lucide-react";

export function NavBar() {
    const { currentUser, status } = useAuth();


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
                    {status === "loading" ? < Loader />: currentUser? 
                    <div className="flex">
                        <Bell />
                        <img src={currentUser.avatar ?? undefined} alt="Profile"/> 
                    </div> : 
                    <div className="text-sm border p-1 rounded-lg" style={{color: "#5A5F68"}}>
                        Login/Signup
                    </div>}
                </div>
            </nav>
            <div className="border-solid border-gray-300 border shadow-xl mt-2"></div>
        
        </>
    )
}