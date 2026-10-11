export function CourierIdentity({ courier, className = "" }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <span
        className="tk-title grid size-14 shrink-0 place-items-center rounded-full bg-brand-fill text-xl text-white"
        aria-hidden
      >
        {courier.first_name?.[0]}
        {courier.second_name?.[0]}
      </span>
      <div className="min-w-0">
        <p className="tk-title text-lg [overflow-wrap:anywhere]">
          {courier.first_name} {courier.second_name}
        </p>
        <p className="tk-label text-[0.875rem] text-brand">Livreur officiel Ticketché</p>
      </div>
    </div>
  );
}
