import { Bold, Italic, Heading2, List, Quote, ArrowLeft, Save, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorContent } from "@tiptap/react";
import { CATEGORIES } from "../types";
import { useEditArticle } from "../hooks/useEditArticle";

export function EditArticle() {
    const {
        title, setTitle,
        category, setCategory,
        articleStatus,
        saving, loading, lastSaved, error,
        editor,
        handleUpdate, handleChangeStatus,
    } = useEditArticle();

    if (loading) return <div className="p-6 text-gray-400 text-sm">Loading article...</div>;

    return (
        <div className="flex flex-col h-full">

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Link to="/dashboard" className="flex items-center gap-1 hover:text-gray-800">
                        <ArrowLeft size={15} />
                        Back to List
                    </Link>
                    <span>•</span>
                    <span>{lastSaved ? `Last saved: ${lastSaved}` : "Unsaved changes"}</span>
                </div>

                <div className="flex items-center gap-2">
                    {error && <span className="text-red-500 text-xs">{error}</span>}
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Save size={15} />
                        Save Draft
                    </button>
                    <button
                        onClick={handleChangeStatus}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#3899FA] text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                    >
                        <Send size={15} />
                        {articleStatus === "published" ? "Unpublish" : "Publish"}
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

                {/* Editor column */}
                <div className="flex-1 flex flex-col overflow-y-auto px-8 py-6">
                    <input
                        type="text"
                        placeholder="Article title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="text-3xl font-bold outline-none placeholder-gray-300 mb-4 w-full"
                    />

                    {/* Toolbar */}
                    <div className="flex items-center gap-1 border-y border-gray-100 py-2 mb-4">
                        <button
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`p-2 rounded-lg ${editor?.isActive("bold") ? "bg-blue-50 text-[#3899FA]" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Bold size={16} />
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded-lg ${editor?.isActive("italic") ? "bg-blue-50 text-[#3899FA]" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Italic size={16} />
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 rounded-lg ${editor?.isActive("heading", { level: 2 }) ? "bg-blue-50 text-[#3899FA]" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Heading2 size={16} />
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            className={`p-2 rounded-lg ${editor?.isActive("bulletList") ? "bg-blue-50 text-[#3899FA]" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            className={`p-2 rounded-lg ${editor?.isActive("blockquote") ? "bg-blue-50 text-[#3899FA]" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Quote size={16} />
                        </button>

                        <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
                            articleStatus === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                            {articleStatus === "published" ? "Published" : "Draft"}
                        </span>
                    </div>

                    <EditorContent editor={editor} />
                </div>

                {/* Right settings panel */}
                <div className="w-64 border-l border-gray-100 px-5 py-6 overflow-y-auto shrink-0 hidden md:block">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Post Settings
                    </div>

                    <div className="mb-5">
                        <div className="text-sm font-semibold mb-3">Category</div>
                        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`text-left px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                                        category === cat
                                            ? "bg-blue-50 text-[#3899FA] font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {cat.replace(/_/g, " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    <button
                        onClick={handleChangeStatus}
                        disabled={saving}
                        className="w-full py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 disabled:opacity-50"
                    >
                        {articleStatus === "published" ? "Unpublish Article" : "Publish Article"}
                    </button>
                </div>
            </div>
        </div>
    );
}
