import { CATEGORIES, type Category } from "../types"



interface SideBarProps {
    category: Category | string
    setCategory: (id: string) => void
    onClose: () => void
}



export function SideBar({category, setCategory, onClose}: SideBarProps) {

    return (
        <div style={{fontWeight: "400", color: "grey"}}>
            <div className="ml-3 w-fit">
                <div className="mb-4 text-sm font-bold">CATEGORY</div>
                <div className="border mb-6 w-10/12" style={{borderColor: "#cfcfcf"}}></div>
                {CATEGORIES.map((item) => (
                    <div key={item} className="flex gap-3 mb-2 text-sm">
                        <input type="checkbox" className="scale-80 cursor-pointer" checked={category === item} onChange={() => setCategory(category === item ? "": item)} onClick={() => onClose()}/>
                        <div className="text-sm flex flex-wrap"> {item}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}