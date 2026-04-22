import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Bold, Italic, Heading2, List, Quote, ArrowLeft, Save, Send } from "lucide-react";
import api from "../utils/api";
import { CATEGORIES, type Category } from "../types";
import { useParams, Link } from "react-router-dom";


export function EditArticle() {
    // useParams reads the :article_id segment from the URL /dashboard/edit/:article_id
    const { article_id } = useParams<{ article_id: string }>();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<Category>("technology");
    const [articleStatus, setArticleStatus] = useState<"published" | "draft">("draft");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [error, setError] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class: "min-h-[400px] outline-none prose prose-sm max-w-none py-4 px-4 border border-gray-200 rounded-lg",
            },
        },
    });

    // Fetch the existing article when the page loads so we can pre-fill the form
    // article_id comes from the URL params — we pass it to the editor endpoint
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/api/v1/article/single_article_editor/${article_id}`);
                const data = response.data;
                setTitle(data.title);
                setCategory(data.category);
                setArticleStatus(data.status);
                // setContent on the editor — we wait until the editor is ready
                // then use commands.setContent() to load existing HTML
                editor?.commands.setContent(data.content);
            } catch {
                setError("Failed to load article");
            } finally {
                setLoading(false);
            }
        };
        if (article_id) fetchArticle();
    // editor is in deps so setContent runs after the editor initializes
    }, [article_id, editor]);

    // Builds multipart/form-data for the PATCH update endpoint
    // Only appends fields that have changed — backend treats all as optional
    const buildFormData = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", editor?.getHTML() ?? "");
        formData.append("category", category);
        return formData;
    };

    const handleUpdate = async () => {
        if (!title.trim()) { setError("Title is required"); return; }
        setError("");
        setSaving(true);
        try {
            await api.patch(`/api/v1/article/update_article/${article_id}`, buildFormData());
            setLastSaved("Just now");
        } catch {
            setError("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    // Calls the change_status endpoint to toggle between published and draft
    const handleChangeStatus = async () => {
        const newStatus = articleStatus === "published" ? "draft" : "published";
        setSaving(true);
        try {
            await api.patch(`/api/v1/article/change_status/${article_id}`, null, {
                params: { new_status: newStatus },
            });
            setArticleStatus(newStatus);
        } catch {
            setError("Failed to change status");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-400 text-sm">Loading article...</div>;

    return (
        <div className="flex flex-col h-full">

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    {/* Back to List navigates to /dashboard (MyArticles) */}
                    <Link to="/dashboard" className="flex items-center gap-1 hover:text-gray-800">
                        <ArrowLeft size={15} />
                        Back to List
                    </Link>
                    <span>•</span>
                    <span>{lastSaved ? `Last saved: ${lastSaved}` : "Unsaved changes"}</span>
                </div>

                <div className="flex items-center gap-2">
                    {error && <span className="text-red-500 text-xs">{error}</span>}

                    {/* Save changes — calls the PATCH update endpoint */}
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Save size={15} />
                        Save Draft
                    </button>

                    {/* Publish / Unpublish — toggles status via change_status endpoint */}
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

                    {/* Title input — pre-filled with existing article title */}
                    <input
                        type="text"
                        placeholder="Article title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="text-3xl font-bold outline-none placeholder-gray-300 mb-4 w-full"
                    />

                    {/* Toolbar — same as CreateArticle */}
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

                        {/* Current status badge — shows Published or Draft */}
                        <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
                            articleStatus === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                            {articleStatus === "published" ? "Published" : "Draft"}
                        </span>
                    </div>

                    {/* Tiptap editor — content is pre-filled via setContent in useEffect */}
                    <EditorContent editor={editor} />
                </div>

                {/* Right settings panel */}
                <div className="w-64 border-l border-gray-100 px-5 py-6 overflow-y-auto shrink-0 hidden md:block">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Post Settings
                    </div>

                    {/* Category selector */}
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

                    {/* Unpublish / Publish button at the bottom of settings panel */}
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
