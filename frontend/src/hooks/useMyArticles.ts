import { useEffect, useState } from "react";
import api from "../utils/api";
import type { Article } from "../types";

export function useMyArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/v1/article/self_articles");
                setArticles(response.data);
            } catch {
                setError("Failed to fetch articles");
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        try {
            await api.delete(`/api/v1/article/delete_article_editor/${id}`);
            setArticles(prev => prev.filter(a => a.id !== id));
        } catch {
            // silently fail
        }
    };

    const totalCount = articles.length;
    const publishedCount = articles.filter(a => a.status === "published").length;
    const draftCount = articles.filter(a => a.status === "draft").length;

    return { articles, loading, error, handleDelete, totalCount, publishedCount, draftCount };
}
