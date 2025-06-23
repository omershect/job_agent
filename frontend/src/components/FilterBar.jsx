export default function FilterBar({ search, setSearch, status, setStatus }) {
  const STATUS_OPTIONS = [
    ['', 'All'],
    ['shortlisted', 'Shortlisted'],
    ['applied', 'Applied'],
    ['interview', 'Interview'],
    ['offer', 'Offer'],
    ['rejected', 'Rejected'],
  ];

  return (
    <div className="rounded-xl bg-white/90 px-6 py-4 shadow ring-1 ring-sky-100">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs…"
          className="w-full md:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-sky-400 focus:ring-sky-300 focus:ring-1"
        />

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-[38px] w-full md:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value || 'all'} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
