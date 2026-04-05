import { useAuth } from "../state/hook"
import { Loader } from "lucide-react";
import { Diamond } from "lucide-react";

export function NavBar() {
    const { currentUser, status } = useAuth();


    return (
        <>
            <nav className="flex mx-auto justify-around mt-2.5">
                <div className="flex gap-1">
                    <div style={{backgroundColor: "#3899FA", padding: "4px", borderRadius: "6px"}} className="h-fit">
                        <Diamond color="white" size={26}/>
                    </div>
                    <div className="text-lg">Knowledge Base</div>
                </div>
                <div>
                    {status === "loading" ? < Loader />: currentUser? <div><img src={currentUser.avatar ?? undefined} alt="Profile"/> </div> : <div className="border-solid border-gray-700 border p-1 rounded-md text-base">Login/Signup</div>}
                </div>
            </nav>
        
        </>
    )
}