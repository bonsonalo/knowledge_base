import type { Article } from "../types";
import { Link } from "react-router";
import { UserRound } from 'lucide-react'


interface ArticleCardProps {
    article: Article
}



export function ArticleCard({article}: ArticleCardProps) {

    return (
        <Link to={`articles/${article.id}`} className="shadow-lg rounded-xl border-0 flex flex-col h-full" style={{borderColor: "#DEDFE3"}}>
            <div className="relative">
                <img src= {article.cover_image ?? undefined} className="h-35 object-cover w-full rounded-t-md"/>
                <div className="absolute bottom-26 left-2 text-base text-white p-px px-1 rounded-xl" style={{backgroundColor: "#0a84ff"}}>
                    {article.category}
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col ">
                <div className="mb-2 text-2xl font-bold line-clamp-2">
                    {article.title}
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2 line-clamp-3 mt-auto">
                    {article.content}
                </div>
            </div>
            <div style={{border: "0.2px solid #cfcfcf"}}></div>
            <div className="flex justify-between px-6 lg:justify-start lg:gap-16 py-2">
                <div style={{alignContent: "center"}}>
                    {article.user.avatar? <img src={article.user.avatar} /> : <UserRound  size={36} className="bg-gray-300 rounded-lg p-1" style={{borderRadius: "50%"}}/>}
                </div>
                <div style={{textAlign: "start"}}>
                    <div className="font-semibold text-sm">
                        {article.user.first_name} {article.user.last_name}
                    </div>
                    <div className="text-sm text-gray-600 text-xsm">
                        {new Date (article.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                      })}
                    </div>
                </div>
            </div>
        </Link>
    )

}