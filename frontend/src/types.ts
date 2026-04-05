

export type Role = "editor" | "admin"


export type Category= 
  "technology" |
  "science" |
  "health"  |
  "business" |
  "education" |
  "finance" |
  "programming" |
  "design" |
  "marketing" |
  "productivity" |
  "artificial_intelligence" |
  "research" |
  "cybersecurity" |
  "personal_development" |
  "other"


export const CATEGORIES = [
  "technology",
  "science",
  "health",
  "business",
  "education",
  "finance",
  "programming",
  "design",
  "marketing",
  "productivity",
  "artificial_intelligence",
  "cybersecurity",
  "personal_development",
  "research",
  "other"
] as const
export interface ArticleAuthor {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar: string | null
}

export interface Article {
    id: string
    title: string
    content: string
    category: Category
    cover_image: string | null
    status: "published" | "draft"
    created_at: string
    user: ArticleAuthor
}

export interface User {
    id: string
    first_name: string
    last_name: string   
    email: string
    role: Role
    avatar: string | null
}

export interface Notification {
    id: string
    user_id: string
    message: string
    is_read: boolean
    created_at: string
}