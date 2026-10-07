export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
