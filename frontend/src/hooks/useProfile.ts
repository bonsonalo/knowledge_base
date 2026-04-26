import { useState } from "react";
import { useAuth } from "../state/hook";
import api from "../utils/api";

export function useProfile() {
    const { currentUser, fetchUser } = useAuth();

    const [firstName, setFirstName] = useState(currentUser?.first_name ?? "");
    const [lastName, setLastName] = useState(currentUser?.last_name ?? "");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatar ?? null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError("First name and last name are required.");
            return;
        }
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const form = new FormData();
            form.append("first_name", firstName.trim());
            form.append("last_name", lastName.trim());
            if (avatarFile) form.append("avatar", avatarFile);
            await api.patch("/api/v1/me/update", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await fetchUser();
            setSuccess("Profile updated successfully.");
            setAvatarFile(null);
        } catch {
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const isDirty =
        firstName !== (currentUser?.first_name ?? "") ||
        lastName !== (currentUser?.last_name ?? "") ||
        avatarFile !== null;

    const roleBadgeStyle =
        currentUser?.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-[#3899FA]";

    return {
        currentUser,
        firstName, setFirstName,
        lastName, setLastName,
        avatarPreview,
        avatarFile,
        saving, success, error,
        handleAvatarChange, handleSave,
        isDirty, roleBadgeStyle,
    };
}
