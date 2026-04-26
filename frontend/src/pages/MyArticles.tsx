import { Eye, FileText, SquareArrowOutUpRight, ThumbsUp, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMyArticles } from "../hooks/useMyArticles";

export function MyArticles() {
    const navigate = useNavigate();
    const { articles, loading, error, handleDelete, totalCount, publishedCount, draftCount } = useMyArticles();
    const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");

    const displayed = activeTab === "all"
        ? articles
        : articles.filter(a => a.status === activeTab);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex flex-col gap-1">
                    <div className="font-bold text-3xl">My Articles</div>
                    <div className="text-gray-500 text-sm">Manage, edit, and track performance of your published works and drafts.</div>
                </div>
                <Link
                    to="/dashboard/create"
                    className="bg-[#3899FA] text-white text-center rounded-lg py-2 px-4 text-sm w-fit"
                >
                    + Create New Article
                </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#F9FAFA] p-4 rounded-lg flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500">Total Articles</div>
                        <div className="font-bold text-2xl">{totalCount}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl">
                        <FileText color="#3899FA" size={20} />
                    </div>
                </div>
                <div className="bg-[#F9FAFA] p-4 rounded-lg flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500">Published</div>
                        <div className="font-bold text-2xl">{publishedCount}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl">
                        <SquareArrowOutUpRight color="#20DF60" size={20} />
                    </div>
                </div>
                <div className="bg-[#F9FAFA] p-4 rounded-lg flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500">Total Views</div>
                        <div className="font-bold text-2xl">0</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl">
                        <Eye color="#3899FA" size={20} />
                    </div>
                </div>
                <div className="bg-[#F9FAFA] p-4 rounded-lg flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500">Engagement</div>
                        <div className="font-bold text-2xl">0%</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl">
                        <ThumbsUp color="#F97316" size={20} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#F9FAFA] p-1 gap-1 w-fit rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-xl text-sm ${activeTab === "all" ? "bg-white shadow-sm font-medium" : "text-gray-500 hover:bg-white"}`}
                >
                    All ({totalCount})
                </button>
                <button
                    onClick={() => setActiveTab("published")}
                    className={`px-4 py-2 rounded-xl text-sm ${activeTab === "published" ? "bg-white shadow-sm font-medium" : "text-gray-500 hover:bg-white"}`}
                >
                    Published ({publishedCount})
                </button>
                <button
                    onClick={() => setActiveTab("draft")}
                    className={`px-4 py-2 rounded-xl text-sm ${activeTab === "draft" ? "bg-white shadow-sm font-medium" : "text-gray-500 hover:bg-white"}`}
                >
                    Drafts ({draftCount})
                </button>
            </div>

            {/* Loading / error */}
            {loading && <div className="text-gray-500 text-sm">Loading...</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Article table */}
            {!loading && !error && (
                <div className="border border-gray-100 rounded-lg overflow-x-auto">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] bg-[#F9FAFA] px-4 py-3 text-sm text-gray-500 font-medium min-w-[700px]">
                        <div>Article Title</div>
                        <div>Status</div>
                        <div>Category</div>
                        <div>Engagement</div>
                        <div>Published</div>
                        <div>Actions</div>
                    </div>

                    {displayed.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">No articles found.</div>
                    ) : (
                        displayed.map(article => (
                            <div
                                key={article.id}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center px-4 py-4 border-t border-gray-100 hover:bg-gray-50 min-w-[700px]"
                            >
                                <div className="flex flex-col gap-0.5 pr-4 min-w-0">
                                    <div className="font-medium text-sm line-clamp-1">{article.title}</div>
                                    <div className="text-xs text-gray-400 line-clamp-1">{article.content}</div>
                                </div>

                                <div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        article.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}>
                                        {article.status === "published" ? "Published" : "Draft"}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 capitalize">
                                    {article.category.replace("_", " ")}
                                </div>

                                <div className="flex gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Eye size={14} /> 0</span>
                                    <span className="flex items-center gap-1"><ThumbsUp size={14} /> 0</span>
                                </div>

                                <div className="text-sm text-gray-500">
                                    {new Date(article.created_at).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric"
                                    })}
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => navigate(`/dashboard/edit/${article.id}`)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 text-sm cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
