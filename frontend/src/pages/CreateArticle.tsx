// useEditor: a hook that creates and manages the Tiptap editor instance
// EditorContent: the React component that renders the actual editable area
import { useEditor, EditorContent } from "@tiptap/react"

// StarterKit: a Tiptap extension bundle that gives us bold, italic, headings,
// lists, blockquote, and more — all in one import
import { StarterKit } from "@tiptap/starter-kit"

import { useState } from "react"

import { Bold, Italic, Heading2, List, Quote, Save, Send, ImageIcon } from "lucide-react"

import api from "../utils/api"

import { CATEGORIES, type Category } from "../types"

import { useNavigate } from "react-router-dom"




export function CreateArticle() {

    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState<Category>("technology")
    const [coverImage, setCoverImage] = useState<File | null>(null)

    // Tracks whether a save/publish request is in progress
    // used to disable buttons so the user can't double-submit
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<string | null>(null)
    const [error, setError] = useState("")

    // --- TIPTAP EDITOR SETUP ---
    // useEditor() creates the editor instance and returns it.
    // We pass it a config object with two keys:

    // extensions: the list of features to enable.
    // StarterKit is a pre-built bundle — it gives us bold, italic,
    // headings, bullet lists, blockquote, undo/redo, etc. in one import.

    // editorProps.attributes: lets us add HTML attributes to the
    // contenteditable div that Tiptap renders.
    // We use it to add Tailwind classes — min-h sets a minimum height
    // so the editor doesn't collapse when empty, outline-none removes
    // the browser's default blue focus ring, and prose adds nice
    // typographic spacing from Tailwind Typography.

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class: "min-h-[400px] outline-none prose prose-sm max-w-none py-4 px-4 border border-gray-200 rounded-lg",
            },
        },
    })

    // --- BUILD FORM DATA ---
    // The backend expects multipart/form-data (not JSON) because it receives
    // a file upload alongside text fields. FormData is a built-in browser API
    // that lets us build that kind of request.

    // We create a new FormData object and append each field by name —
    // the names must exactly match what the backend's Form(...) parameters expect.

    // editor?.getHTML() — the ?. is optional chaining: if editor is null
    // (not yet initialized), it returns undefined instead of crashing.
    // ?? "" means "if undefined, use empty string instead"

    const buildFormData = () => {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", editor?.getHTML() ?? "")
        formData.append("category", category)
        // file is required by the backend — only append if the user chose one
        if (coverImage) formData.append("file", coverImage)
        return formData
    }

    // --- SUBMIT HANDLERS ---


    const handleSaveDraft = async () => {
        // Validate before sending — if something is missing, set the error
        // message and return early so the request never fires
        if (!title.trim()) { setError("Title is required"); return }
        if (!coverImage) { setError("Cover image is required"); return }

        // Clear any previous error and mark as saving (disables buttons)
        setError("")
        setSaving(true)

        try {
            await api.post("/api/v1/article/draft_article", buildFormData())

            // On success, update the last saved label in the top bar
            setLastSaved("Just now")
        } catch {
            setError("Failed to save draft")
        } finally {
            // finally always runs — re-enable buttons whether it succeeded or failed
            setSaving(false)
        }
    }

    const handlePublish = async () => {
        if (!title.trim()) { setError("Title is required"); return }
        if (!coverImage) { setError("Cover image is required"); return }

        setError("")
        setSaving(true)

        try {
            await api.post("/api/v1/article/publish_article", buildFormData())
            navigate("/dashboard")
        } catch {
            setError("Failed to publish article")
        } finally {
            setSaving(false)
        }
    }

    return (
        // flex-col so top bar stacks above the editor body
        // h-full so the layout fills the outlet area
        <div className="flex flex-col h-full">

            {/* --- TOP BAR (Step 6) ---
                flex + justify-between pushes left content and buttons to opposite ends
                border-b separates it visually from the editor below */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">

                {/* Left side: shows current save state */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Draft</span>
                    <span>•</span>
                    {/* if lastSaved is null (nothing saved yet) show "Not saved yet"
                        otherwise show "Last saved: Just now" */}
                    <span>{lastSaved ? `Last saved: ${lastSaved}` : "Not saved yet"}</span>
                </div>

                {/* Right side: error message + action buttons */}
                <div className="flex items-center gap-2">
                    {/* only renders the error span when error is a non-empty string */}
                    {error && <span className="text-red-500 text-xs">{error}</span>}

                    {/* Save Draft button — calls handleSaveDraft on click
                        disabled prop greys it out and blocks clicks while saving */}
                    <button
                        onClick={handleSaveDraft}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Save size={15} />
                        Save Draft
                    </button>

                    {/* Publish button — calls handlePublish on click */}
                    <button
                        onClick={handlePublish}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#3899FA] text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                    >
                        <Send size={15} />
                        Publish
                    </button>
                </div>
            </div>

            {/* --- EDITOR BODY --- */}
            <div className="flex flex-1 overflow-hidden">

                {/* Editor column — takes all available width, scrolls independently */}
                <div className="flex-1 flex flex-col overflow-y-auto px-8 py-6">

                    {/* --- COVER IMAGE UPLOAD (Step 7) ---
                        We use a <label> as the clickable area instead of a button.
                        When a label wraps (or points to) a file input, clicking the label
                        opens the file picker — so we hide the input and style the label instead.

                        URL.createObjectURL(file) creates a temporary local URL from the File
                        object so we can preview it in an <img> before it's uploaded. */}
                    <label className="cursor-pointer mb-4">
                        {coverImage ? (
                            // if a file is selected, show a preview of it
                            <img
                                src={URL.createObjectURL(coverImage)}
                                alt="cover preview"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        ) : (
                            // if no file yet, show a dashed placeholder the user can click
                            <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm hover:border-blue-300 hover:text-blue-400 transition-colors">
                                <ImageIcon size={18} className="mr-2" />
                                Click to add cover image
                            </div>
                        )}
                        {/* hidden — the actual file input is invisible, the label triggers it
                            accept="image/*" restricts the picker to image files only
                            onChange fires when the user picks a file — e.target.files is an
                            array-like FileList, so [0] gets the first (and only) file */}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => setCoverImage(e.target.files?.[0] ?? null)}
                        />
                    </label>

                    <input
                        type="text"
                        placeholder="Article title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="text-3xl font-bold outline-none placeholder-gray-300 mb-4 w-full"
                    />

                    {/* --- TOOLBAR (Step 9) ---
                        Each button calls editor.chain().focus().toggleX().run()
                        - chain() starts a sequence of commands
                        - focus() keeps the cursor in the editor so it doesn't lose position
                        - toggleX() turns that format on if off, off if on
                        - run() executes the whole chain
                        editor?.isActive("bold") is a built-in Tiptap method — it returns
                        true when the cursor is currently inside text with that format applied.
                        We use it to highlight the button blue when its format is active. */}
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
                    </div>

                    {/* --- EDITOR CONTENT (Step 10) ---
                        EditorContent is the React component from @tiptap/react that renders
                        the actual contenteditable div where the user types.
                        We pass it the editor instance we created with useEditor() in Step 3.
                        Tiptap handles all the typing, formatting, cursor management internally —
                        we just place this component and it does the rest.
                        The Tailwind classes we added via editorProps.attributes (Step 3)
                        are applied to the div that EditorContent renders. */}
                    <EditorContent editor={editor} />

                </div>

                {/* --- RIGHT SETTINGS PANEL (Step 11) ---
                    shrink-0 prevents this panel from being squeezed by the editor column.
                    hidden md:block hides it on mobile (no room) and shows it on md+ screens.
                    overflow-y-auto lets the panel scroll independently if content is tall. */}
                <div className="w-64 border-l border-gray-100 px-5 py-6 overflow-y-auto shrink-0 hidden md:block">

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Article Settings
                    </div>

                    {/* CATEGORY LIST
                        We map over CATEGORIES from types.ts — each item is a button.
                        Clicking one calls setCategory(cat) to update the category state.
                        The active category gets a blue highlight, others get a hover effect.
                        replace(/_/g, " ") replaces underscores with spaces for display
                        e.g. "artificial_intelligence" → "artificial intelligence" */}
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

                    {/* CHECKBOXES — UI only, no backend field yet
                        accent-[#3899FA] changes the checkbox tick color to match our blue */}
                    <div className="flex flex-col gap-4 mb-5">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="text-sm font-medium">Public Access</div>
                                <div className="text-xs text-gray-400">Allow anyone to read</div>
                            </div>
                            <input type="checkbox" defaultChecked className="mt-1 accent-[#3899FA] w-4 h-4 cursor-pointer" />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="text-sm font-medium">Allow Comments</div>
                                <div className="text-xs text-gray-400">Enable user feedback</div>
                            </div>
                            <input type="checkbox" defaultChecked className="mt-1 accent-[#3899FA] w-4 h-4 cursor-pointer" />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="text-sm font-medium">SEO Optimized</div>
                                <div className="text-xs text-gray-400">Auto-generate metadata</div>
                            </div>
                            <input type="checkbox" className="mt-1 accent-[#3899FA] w-4 h-4 cursor-pointer" />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* INFO BOX — static text, placeholder number for followers */}
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 leading-relaxed">
                        Publishing will notify your <strong>124 followers</strong> and add this piece to the <strong>Featured</strong> section.
                    </div>
                </div>

            </div>

        </div>
    )
}