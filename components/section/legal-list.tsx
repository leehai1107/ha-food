interface LegalListProps {
    items: string[];
    selected: string;
    onSelect: (item: string) => void;
}

export default function LegalList({ items, selected, onSelect }: LegalListProps) {
    return (
        <div className="animate-float-in-top">
            <ul className="text-primary text-base md:text-lg font-medium list-none">
                {items.map((item) => (
                    <li
                        className={`py-3 px-4 border-b-2 border-primary cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${selected === item ? "font-bold bg-gray-50" : ""
                            }`}
                        key={item}
                        onClick={() => onSelect(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
