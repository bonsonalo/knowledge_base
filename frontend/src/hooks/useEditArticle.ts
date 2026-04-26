import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import api from "../utils/api";
import type { Category } from "../types";

export function useEditArticle() {
    const { article_id } = useParams<{ article_id: string }>();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<Category>("technology");
    const [articleStatus, setArticleStatus] = useState<"published" | "draft">("draft");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [error, setError] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class: "min-h-[400px] outline-none prose prose-sm max-w-none py-4 px-4 border border-gray-200 rounded-lg",
            },
        },
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/api/v1/article/single_article_editor/${article_id}`);
                const data = response.data;
                setTitle(data.title);
                setCategory(data.category);
                setArticleStatus(data.status);
                editor?.commands.setContent(data.content);
            } catch {
                setError("Failed to load article");
            } finally {
                setLoading(false);
            }
        };
        if (article_id) fetchArticle();
    }, [article_id, editor]);

    const buildFormData = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", editor?.getHTML() ?? "");
        formData.append("category", category);
        return formData;
    };

    const handleUpdate = async () => {
        if (!title.trim()) { setError("Title is required"); return; }
        setError("");
        setSaving(true);
        try {
            await api.patch(`/api/v1/article/update_article/${article_id}`, buildFormData());
            setLastSaved("Just now");
        } catch {
            setError("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleChangeStatus = async () => {
        const newStatus = articleStatus === "published" ? "draft" : "published";
        setSaving(true);
        try {
            await api.patch(`/api/v1/article/change_status/${article_id}`, null, {
                params: { new_status: newStatus },
            });
            setArticleStatus(newStatus);
        } catch {
            setError("Failed to change status");
        } finally {
            setSaving(false);
        }
    };

    return {
        title, setTitle,
        category, setCategory,
        articleStatus,
        saving, loading, lastSaved, error,
        editor,
        handleUpdate, handleChangeStatus,
    };
}
