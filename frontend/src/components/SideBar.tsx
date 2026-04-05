import { Search } from "lucide-react"
import { CATEGORIES, type Category } from "../types"



interface SideBarProps {
    search: string
    setSearch: (id: string) => void
    category: Category | string
    setCategory: (id: string) => void
    onClose: () => void
}



export function SideBar({search, setSearch, category, setCategory, onClose}: SideBarProps) {

    return (
        <div>
            <button onClick={onClose}>X</button>
            <div>SEARCH</div>
            <div>
                <input type="text" placeholder="Keywords..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Search />
            </div>
            <div></div>
            <div>
                <div>CATEGORY</div>
                {CATEGORIES.map((item) => (
                    <div key={item}>
                        <input type="checkbox" checked={category === item} onChange={() => setCategory(category === item ? "": item)}/>
                        <div> {item}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}