import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PageSideBar } from "./PageSideBar";
import { Menu, X } from "lucide-react";


export function DashboardLayout() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row flex-1">
            <div className="md:hidden flex items-center px-4 py-2">
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            <PageSideBar isOpen={isOpen} /> 
            <div className="flex-1 w-11/12 mx-auto">
                <Outlet />
            </div>
        </div>
    )
}