const TONES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-100',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-200',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-200',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200',
};

export default function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}><Icon size={20} /></div>
      <div className="min-w-0">
        <p className="muted text-sm">{label}</p>
        <p className="font-display text-2xl font-bold leading-tight">{value}</p>
        {hint && <p className="muted mt-0.5 text-xs">{hint}</p>}
      </div>
    </div>
  );
}
