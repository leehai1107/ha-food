interface LegalListProps {
    items: string[];
    selected: string;
    onSelect: (item: string) => void;
}

export default function LegalList({ items, selected, onSelect }: LegalListProps) {
    return (
        <div className="animate-float-in-top">
            <ul className="text-primary text-lg font-medium list-none">
                {items.map((item) => (
                    <li
                    className="py-4 px-4 hover:bg-gray-100 transition-colors duration-200 border-b-2 border-primary"
                        key={item}
                        style={{
                            cursor: "pointer",
                            fontWeight: selected === item ? "bold" : "normal",
                        }}
                        onClick={() => onSelect(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
