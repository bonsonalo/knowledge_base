import { CATEGORIES, type Category } from "../types";

interface SideBarProps {
    category: Category | string;
    setCategory: (id: string) => void;
    onClose: () => void;
}

export function SideBar({ category, setCategory, onClose }: SideBarProps) {
    const handleSelect = (item: string) => {
        setCategory(category === item ? "" : item);
        onClose();
    };

    return (
        <div className="p-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Category
            </div>
            <div className="border-b border-gray-100 mb-3" />
            <div className="flex flex-col gap-0.5">
                <button
                    onClick={() => { setCategory(""); onClose(); }}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        !category
                            ? "bg-[#E7F2FF] text-[#3899FA] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    All Categories
                </button>
                {CATEGORIES.map((item) => (
                    <button
                        key={item}
                        onClick={() => handleSelect(item)}
                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                            category === item
                                ? "bg-[#E7F2FF] text-[#3899FA] font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {item.replace(/_/g, " ")}
                    </button>
                ))}
            </div>
        </div>
    );
}
