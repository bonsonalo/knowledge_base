import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import type { Article } from "../types";
import api from "../utils/api";
import { ChevronLeft, CircleUserRound, ThumbsUp, Trash2 } from "lucide-react";
import { useAuth } from "../state/hook";




export function ArticleDetail() {

    const [article, setArticle]= useState<Article | null>(null);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const { article_id }= useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleDelete = async () => {
        // confirm() shows a native browser popup — returns true if user clicks OK
        if (!confirm("Are you sure you want to delete this article?")) return;
        setDeleting(true);
        try {
            await api.delete(`/api/v1/article/delete_article_editor/${article_id}`);
            navigate("/dashboard");
        } catch {
            setError("Failed to delete article");
            setDeleting(false);
        }
    };

    useEffect(() => {
        const fetchArticle= async () => {
            try{
                const response= await api.get(`/api/v1/article/single_article/${article_id}`);
                setArticle(response.data);
            }
            catch {
                setError("failed to fetche the article")
            }
        }
        fetchArticle();
    }, [article_id])


    return (
        <div className="mt-8 w-5/6 mx-auto md:w-4/6 lg:w-3/6">
            <div className="flex justify-between items-center mb-8">
                <Link to={"/"} className="flex gap-3 items-center">
                    <div><ChevronLeft size={21}/></div>
                    <div className="text-xs lg:text-sm">Back to articles</div>
                </Link>

                {/* Only show delete button if the user is logged in */}
                {isAuthenticated && (
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                    >
                        <Trash2 size={15} />
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                )}
            </div>
            <div className="bg-[#D7EBFE] text-sm w-fit text-[#3899FA] rounded-xl mb-3 lg:p-1 lg:mb-4">
                {article?.category}
            </div>
            <div className="text-3xl font-bold mb-4 lg:text-4xl">
                {article?.title}
            </div>
            <div className="line-clamp-3 text-sm mb-3 lg:text-base">
                {article?.content}
            </div>
            <div className="flex justify-start gap-5 lg:gap-10 border-t-2 border-b-2 py-3 border-gray-200 mb-6 items-center">
                <div>
                    {article?.author?.avatar ? <img src={article?.author?.avatar}/> : <Link to={"#"}><CircleUserRound size={30}/></Link>}
                </div>
                <div>
                    <div className="font-bold lg:text-xl">
                        {article?.author?.first_name} {article?.author?.last_name}
                    </div>
                    <div>
                        { article ? new Date (article.created_at).toLocaleString("en-US", {
                            year:"numeric",
                            month: "short",
                            day: "numeric"
                        }) : null}
                        
                    </div>
                </div>
            </div>
            <div>
                <img src={article?.cover_image ?? undefined} alt="" 
                    style={{backgroundImage: "cover"}}
                    className=" w-full rounded-xl aspect-video lg:w-3/4"
                    />
                <div className="text-xs lg:text-sm opacity-50 text-center mt-2 lg:mt-3 lg:text-start lg:pl-5">
                    Modern knowledge architecture utilizes distributed indexing for high-availability.
                </div>
            </div>
            <div className="mt-8 text-sm lg:text-base">
                {article?.content}
            </div>
            <div className="flex flex-col items-center bg-[#F9FAFA] mt-4 rounded-xl py-6 px-2 lg:mt-10 lg:p-9 ">
                <div className="mb-4">< ThumbsUp size= {30} color="#3899FA"/></div>
                <div className="font-bold mb-2 lg:text-2xl">Was this article helpful?</div>
                <div className="text-center text-xs lg:text-sm">Your feedback helps us improve the quality of our knowledge base.</div>
                <div className="flex justify-between gap-1 text-sm mt-6 lg:gap-7">
                    <Link to={"#"} className=" block bg-[#3899FA] p-1 lg:p-2 rounded-xl text-white">Yes it helped</Link>
                    <Link to={"#"} className="block bg-[#FFFFFF] border border-[#cfcfcf] shadow-sm rounded-xl p-1 lg:p-2">No, I need more info</Link>
                </div>
            </div>

        </div>
    )
}