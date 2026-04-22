import { Loader, MoveRight, SlidersHorizontal, X } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Article } from '../types';
import { SideBar } from '../components/SideBar';
import heroImage from './../../assets/knowlegde_final.jpg';
import { Link } from 'react-router-dom';

export function ArticlePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState("desc");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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

    return (
        <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

            {/* Hero */}
            <section className="bg-[#F0F7FF] py-20">
                <div className="mx-auto w-11/12 lg:w-10/12 flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text */}
                    <div>
                        <span className="inline-block text-xs font-semibold text-[#3899FA] bg-[#E7F2FF] border border-[#C4E1FE] px-3 py-1 rounded-full mb-4">
                            Knowledge Base Platform
                        </span>
                        <h1 className="text-4xl font-bold mb-4 text-center lg:text-left leading-tight">
                            Unlock the Collective{" "}
                            <span className="text-[#3899FA]">Intelligence</span>{" "}
                            of Your Team
                        </h1>
                        <p className="text-gray-500 text-base mb-8 text-center lg:text-left">
                            Explore deep-dives, engineering post-mortems, and design patterns from the industry's leading contributors.
                        </p>

                        {/* Search */}
                        <div className="flex gap-2 mb-10">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 px-4 h-10 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3899FA] text-sm bg-white transition-colors"
                            />
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 justify-center lg:justify-start">
                            {[
                                { value: "2.4k+", label: "Articles" },
                                { value: "120", label: "Authors" },
                                { value: "16", label: "Categories" },
                            ].map((stat, i, arr) => (
                                <div key={stat.label} className="flex items-center gap-8">
                                    <div className="flex flex-col items-center lg:items-start">
                                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className="h-8 border-r border-gray-300" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero image */}
                    <div className="hidden lg:block relative">
                        <img
                            src={heroImage}
                            alt="Knowledge base"
                            className="rounded-3xl w-full h-full object-cover"
                        />
                        <div className="absolute bottom-8 left-6 text-white">
                            <div className="text-xs opacity-70 font-semibold mb-1">Featured Today</div>
                            <div className="text-xl font-bold">Scaling Distributed Systems at Velocity</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toolbar */}
            <div className="mx-auto w-11/12 lg:w-10/12 flex items-center justify-between mt-6 mb-4">
                <span className="text-sm text-gray-400">
                    {!loading && `${articles.length} article${articles.length !== 1 ? "s" : ""}`}
                </span>
                <div className="flex items-center gap-2">
                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setIsFilterOpen(v => !v)}
                        className="md:hidden flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        {isFilterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
                        {isFilterOpen ? "Close" : "Filters"}
                    </button>

                    {/* Sort */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                        <span className="text-xs text-gray-400 hidden sm:block">Sort:</span>
                        <select
                            className="text-sm text-gray-600 focus:outline-none bg-transparent cursor-pointer"
                            onChange={(e) => setSortBy(e.target.value)}
                            value={sortBy}
                        >
                            <option value="created_at">Date</option>
                            <option value="title">Title</option>
                        </select>
                        <select
                            className="text-sm text-gray-600 focus:outline-none bg-transparent cursor-pointer"
                            onChange={(e) => setOrder(e.target.value)}
                            value={order}
                        >
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto w-11/12 lg:w-10/12 md:grid md:grid-cols-[220px_1fr] gap-6 mb-12">
                {/* Sidebar */}
                <div className={`${isFilterOpen ? "block" : "hidden"} md:block`}>
                    <div className="border border-gray-100 rounded-xl shadow-sm mb-6 md:mb-0 md:sticky md:top-20">
                        <SideBar
                            category={category}
                            setCategory={setCategory}
                            onClose={() => setIsFilterOpen(false)}
                        />
                    </div>
                </div>

                {/* Article grid */}
                <div>
                    {loading && (
                        <div className="flex justify-center py-16">
                            <Loader className="animate-spin text-gray-400" size={28} />
                        </div>
                    )}
                    {error && (
                        <div className="text-red-500 text-sm py-12 text-center">{error}</div>
                    )}
                    {!loading && !error && articles.length === 0 && (
                        <div className="text-gray-400 text-sm py-12 text-center">No articles found.</div>
                    )}
                    {!loading && !error && articles.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Spotlight banner */}
            <div className="mx-auto w-11/12 lg:w-10/12 mb-12">
                <div className="bg-[#D7EBFE] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="inline-block text-xs font-semibold text-white bg-[#3899FA] px-2 py-1 rounded-lg mb-2">
                            Spotlight Series
                        </span>
                        <div className="font-bold text-base mb-1 text-gray-900">
                            The Engineering Management Handbook
                        </div>
                        <div className="text-sm text-gray-600 max-w-sm">
                            A curated collection of over 20 articles covering everything from hiring strategies to conflict resolution and performance reviews.
                        </div>
                    </div>
                    <Link
                        to="#"
                        className="shrink-0 bg-[#3899FA] p-3 rounded-full hover:brightness-110 transition-all"
                    >
                        <MoveRight color="white" size={20} />
                    </Link>
                </div>
            </div>

        </div>
    );
}
