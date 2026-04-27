import type { Article } from "../types";
import { Link } from "react-router-dom";

export function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            to={`/${article.id}`}
            className="border border-gray-100 shadow-xs rounded-xl flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden bg-white"
        >
            {/* Cover image */}
            <div className="relative">
                <img
                    src={article.cover_image ?? undefined}
                    className="h-44 object-cover w-full"
                />
                <span className="absolute top-2 left-2 text-xs text-white bg-[#3899FA] px-2 py-0.5 rounded-full capitalize">
                    {article.category.replace(/_/g, " ")}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="font-bold text-base line-clamp-2 leading-snug text-gray-900">
                    {article.title}
                </div>
                <div className="text-sm text-gray-500 line-clamp-3 flex-1">
                    {article.content.replace(/<[^>]*>/g, "")}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
                {article.author.avatar ? (
                    <img
                        src={article.author.avatar}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[#3899FA] flex items-center justify-center text-white text-sm font-medium shrink-0">
                        {article.author.first_name?.[0]?.toUpperCase()}
                    </div>
                )}
                <div>
                    <div className="text-sm font-medium leading-tight text-gray-800">
                        {article.author.first_name} {article.author.last_name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {new Date(article.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>
        </Link>
    );
}
