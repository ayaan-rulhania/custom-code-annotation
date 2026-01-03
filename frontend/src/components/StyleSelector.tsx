import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const styles = [
  { id: "inline", label: "Inline comments" },
  { id: "block", label: "Block comments" },
  { id: "color", label: "ANSI colors" },
  { id: "side-by-side", label: "Side-by-side" }
];

export default function StyleSelector({ value, onChange }: Props) {
  return (
    <div className="style-selector">
      <h2>Base annotation style</h2>
      <div className="options">
        {styles.map((s) => (
          <label key={s.id} className={`style-option ${s.id === value ? "active" : ""}`}>
            <input
              type="radio"
              name="annotation-style"
              value={s.id}
              checked={s.id === value}
              onChange={() => onChange(s.id)}
            />
            {s.label}
          </label>
        ))}
      </div>
    </div>
  );
}

