import { useEffect, useState } from "react";
import api from "../utils/api";
import type { Notification } from "../types";

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const handleMarkRead = async (id: string) => {
        try {
            await api.put(`/api/v1/notification/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch {
            // not critical enough to surface
        }
    };

    const handleMarkAllRead = async () => {
        const unread = notifications.filter(n => !n.is_read);
        await Promise.all(unread.map(n => api.put(`/api/v1/notification/${n.id}/read`)));
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const timeAgo = (dateStr: string) => {
        const utcStr = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
        const diff = Math.floor((Date.now() - new Date(utcStr).getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return { notifications, loading, error, handleMarkRead, handleMarkAllRead, timeAgo, unreadCount };
}
