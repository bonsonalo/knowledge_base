import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit"
import { useState } from "react";
import type { Category } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";


export function useCreateArticle() {


    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<Category>("technology");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [error, setError] = useState("")
    // Tracks whether a save/publish request is in progress
    // used to disable buttons so the user can't double-submit
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<string | null>(null)


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

    const buildFormData = () => {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", editor?.getHTML() ?? "")
        formData.append("category", category)
        // file is required by the backend — only append if the user chose one
        if (coverImage) formData.append("file", coverImage)
        return formData
    }

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



    return { handlePublish, handleSaveDraft, title, category, setTitle, setCategory, coverImage, setCoverImage, error, setError, saving, setSaving, lastSaved, setLastSaved, editor }
} 