import { useAuth } from "../state/hook"
import { Loader } from "lucide-react";


export function NavBar() {
    const { currentUser, status } = useAuth();


    return (
        <>
            <nav>
                <div>
                    Knowledge Base
                </div>
                <div>
                    {status === "loading" ? < Loader />: currentUser? <div><img src={currentUser.avatar ?? undefined} alt="Profile"/> </div> : <div>Login/Signup</div>}
                </div>
            </nav>
        
        </>
    )
}