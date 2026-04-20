import { CirclePlus, FileText, Bell, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/hook";

interface PageSideBarProps {
    isOpen: boolean;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
            ? "bg-white text-[#3899FA] font-medium shadow-sm"
            : "text-gray-600 hover:bg-white hover:text-gray-900"
    }`;

export function PageSideBar({ isOpen }: PageSideBarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className={`bg-[#F9FAFA] flex-col ${isOpen ? "flex" : "hidden"} md:flex md:w-48 shrink-0 min-h-full px-3 pt-6 pb-4 gap-1 justify-between`}>
            <div className="flex flex-col gap-1">
                <NavLink to="/dashboard" end className={navLinkClass}>
                    <FileText size={18} />
                    <span>My Articles</span>
                </NavLink>
                <NavLink to="/dashboard/create" className={navLinkClass}>
                    <CirclePlus size={18} />
                    <span>Create New</span>
                </NavLink>
                <NavLink to="/dashboard/notifications" className={navLinkClass}>
                    <Bell size={18} />
                    <span>Notifications</span>
                </NavLink>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-white transition-colors w-full"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </div>
    );
}
