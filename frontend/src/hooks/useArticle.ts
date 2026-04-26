import { useEffect, useState } from "react";
import type { ArticleFilters } from "./useArticleFilter";
import api from "../utils/api";
import type { Article } from "../types";


export function useArticle({search, category, sortBy, order}: ArticleFilters) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/v1/article/all_articles", {
                    params: {
                        ...(debouncedSearch && { title: debouncedSearch, author_name: debouncedSearch }),
                        ...(category && { category }),
                        sort_by: sortBy,
                        order,
                    },
                });
                setArticles(response.data);
            } catch {
                setError("Failed to fetch articles");
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [debouncedSearch, category, sortBy, order]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    
    return { articles, error, loading };


}
    