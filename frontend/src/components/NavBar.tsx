import { useAuth } from "../state/hook"
import { Loader, Diamond, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { Notification } from "../types";

export function NavBar() {
    const { currentUser, status } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(0);

    useEffect(() => {
        if (currentUser) {
            const fetchNotifications = () => {
                api.get("/api/v1/notification")
                    .then(response => {
                        const unreadCount = response.data.filter((n: Notification) => !n.is_read).length;
                        setNotifications(unreadCount);
                    })
                    .catch(() => setNotifications(0));
            };
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <nav className="mx-auto flex items-center justify-between h-14 w-11/12 lg:w-10/12">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-[#3899FA] p-1 rounded-lg">
                        <Diamond color="white" size={22} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Knowledge Base</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-1">
                    {status === "loading" ? (
                        <Loader size={18} className="animate-spin text-gray-400" />
                    ) : currentUser ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Dashboard
                            </Link>

                            {/* Bell */}
                            <Link
                                to="/dashboard/notifications"
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Bell size={20} className="text-gray-600" />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#3899FA] text-white text-[10px] leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                        {notifications}
                                    </span>
                                )}
                            </Link>

                            {/* Avatar */}
                            <Link to="/profile" className="ml-1">
                                {currentUser.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#3899FA] flex items-center justify-center text-white text-sm font-medium">
                                        {currentUser.first_name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Login / Sign up
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}
