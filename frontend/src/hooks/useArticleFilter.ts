import { useState } from "react";




export interface ArticleFilters {
    search: string;
    category: string;
    sortBy: string;
    order: string;
}

const defaultFilters: ArticleFilters= {
    search: "",
    category: "",
    sortBy: "created_at",
    order: "desc",
}

export function useArticleFilters() {
    const [filters, setFilters]= useState<ArticleFilters>(defaultFilters);

    const updateFilters= (key: keyof ArticleFilters, value: string) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    return {updateFilters, filters};
} 