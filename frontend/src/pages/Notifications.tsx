import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Notification } from "../types";


export function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/api/v1/notification/");
                setNotifications(response.data);
            } catch {
                setError("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    // Mark a single notification as read — calls the backend then updates local state
    // so the UI reflects the change immediately without a full refetch
    const handleMarkRead = async (id: string) => {
        try {
            await api.put(`/api/v1/notification/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch {
            // silently fail — not critical enough to show an error
        }
    };

    // Mark all as read — calls mark read for each unread one in parallel using Promise.all
    const handleMarkAllRead = async () => {
        const unread = notifications.filter(n => !n.is_read);
        await Promise.all(unread.map(n => api.put(`/api/v1/notification/${n.id}/read`)));
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const displayed = activeTab === "all"
        ? notifications
        : notifications.filter(n => !n.is_read);

    // Formats created_at ISO string into a relative time label e.g. "2 mins ago"
    const timeAgo = (dateStr: string) => {
        // If the string has no timezone indicator, JavaScript treats it as local time.
        // Appending Z forces it to be parsed as UTC, matching how the backend stores it.
        const utcStr = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
        const diff = Math.floor((Date.now() - new Date(utcStr).getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    return (
        <div className="p-6 max-w-4xl">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex flex-col gap-1">
                    <div className="font-bold text-3xl">Notifications</div>
                    <div className="text-gray-500 text-sm">
                        Stay updated with engagement and system activities across your publications.
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Mark all as read — only active when there are unread notifications */}
                    <button
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <CheckCheck size={15} />
                        Mark all as read
                    </button>
                    <Link
                        to="/dashboard/create"
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#3899FA] text-white rounded-lg hover:bg-blue-500"
                    >
                        New Article
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-100 mb-4">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                        activeTab === "all"
                            ? "border-[#3899FA] text-[#3899FA]"
                            : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveTab("unread")}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                        activeTab === "unread"
                            ? "border-[#3899FA] text-[#3899FA]"
                            : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                >
                    {/* shows count badge only if there are unread notifications */}
                    Unread {unreadCount > 0 && (
                        <span className="ml-1 bg-blue-100 text-[#3899FA] text-xs px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Loading / error */}
            {loading && <div className="text-gray-400 text-sm">Loading notifications...</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Notification list */}
            {!loading && !error && (
                <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden">
                    {displayed.length === 0 ? (
                        <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
                            <Bell size={32} className="opacity-30" />
                            <span className="text-sm">No notifications</span>
                        </div>
                    ) : (
                        displayed.map(notification => (
                            <div
                                key={notification.id}
                                className={`flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100 last:border-0 transition-colors ${
                                    // unread notifications get a subtle blue left border + light bg
                                    !notification.is_read
                                        ? "border-l-4 border-l-[#3899FA] bg-blue-50/30"
                                        : "border-l-4 border-l-transparent"
                                }`}
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {/* Icon — bell for unread, check for read */}
                                    <div className={`mt-0.5 p-2 rounded-full shrink-0 ${
                                        !notification.is_read ? "bg-blue-100" : "bg-gray-100"
                                    }`}>
                                        {notification.is_read
                                            ? <Check size={14} className="text-gray-400" />
                                            : <Bell size={14} className="text-[#3899FA]" />
                                        }
                                    </div>

                                    <div className="flex flex-col gap-1 min-w-0">
                                        {/* The message string from the backend */}
                                        <div className="text-sm text-gray-800">{notification.message}</div>

                                        {/* Time ago + mark as read button */}
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <Clock size={11} />
                                                {timeAgo(notification.created_at)}
                                            </span>
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => handleMarkRead(notification.id)}
                                                    className="text-xs text-[#3899FA] hover:underline"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Bottom stats — placeholder values, no backend yet */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="border border-gray-100 rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Recent Loves
                        </div>
                        <div className="font-bold text-2xl">0</div>
                        <div className="text-xs text-gray-400 mt-1">No data yet</div>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Total Comments
                        </div>
                        <div className="font-bold text-2xl">0</div>
                        <div className="text-xs text-gray-400 mt-1">No data yet</div>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Need help?
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Check our community guidelines for engaging with readers.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
