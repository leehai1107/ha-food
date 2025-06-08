interface Props {
    value: number
    setValue: (val: number) => void
    max: number
}

export default function QuantityInput({ value, setValue, max }: Props) {
    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => setValue(Math.max(1, value - 1))} disabled={value <= 1}>-</button>
            <input
                type="number"
                value={value}
                onChange={e => setValue(Math.min(max, Math.max(1, Number(e.target.value))))}
                className="w-16 text-center border rounded"
            />
            <button onClick={() => setValue(Math.min(max, value + 1))} disabled={value >= max}>+</button>
        </div>
    )
}
  