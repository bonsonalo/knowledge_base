import { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import type { Article } from "../types";



export function useArticleDetail() {

    const [article, setArticle]= useState<Article | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { article_id }= useParams();


    useEffect(() => {
    const fetchArticle= async () => {
        try{
            const response= await api.get(`/api/v1/article/single_article/${article_id}`);
            setArticle(response.data);
        }
        catch {
            setError("failed to fetche the article")
        } finally {
            setLoading(false);
        }
    }
    fetchArticle();
    }, [article_id])



    return {article, article_id, setError, error, loading}
    
}