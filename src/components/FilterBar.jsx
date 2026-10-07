export default function FilterBar({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            value === o.value
              ? 'bg-brand-600 text-white'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-surface dark:text-slate-300 dark:ring-line dark:hover:bg-white/5'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
