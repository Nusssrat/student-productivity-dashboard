export default function ProgressRing({ value = 0, size = 120, stroke = 10, color = '#3b4cca', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-100 dark:stroke-white/10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={color} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset .5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
