import type { Article } from "../types";
import { Link } from "react-router";



interface ArticleCardProps {
    article: Article
}



export function ArticleCard({article}: ArticleCardProps) {
    const truncate= (text: string, limit: number) => {
        return text.length > limit ? text.slice(0, limit) + "...": text
    }

    return (
        <div>
            <Link to={`articles/${article.id}`}>
                <div>
                    {article.cover_image ? <img src= {article.cover_image} /> : <div>Not available</div>}
                    <p>{article.category}</p>
                </div>
                <div>{article.title}</div>
                <div>{truncate(article.content, 60)}</div>
                <div>
                    {article.user.avatar ? <img src= {article.user.avatar} /> : <div>Not available</div>}
                    <div>{article.user.first_name} {article.user.last_name}</div>
                    <div>{article.created_at}</div>
                </div>
            </Link>
        </div>
    )

}