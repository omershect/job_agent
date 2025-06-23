import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

export default function JobTable({ data, isLoading }) {
  const [sorting, setSorting] = useState([]);

  const columns = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Company', accessorKey: 'company' },
    { header: 'Location', accessorKey: 'location' },
    {
      header: 'Match %',
      accessorKey: 'match_score',
      cell: (info) => `${Math.round(info.getValue() * 100)}%`,
    },
    {
      header: 'Rec.',
      accessorKey: 'recommendation',
      cell: (info) => (
        <span
          className={
            info.getValue() === 'apply'
              ? 'rounded bg-green-500/20 px-2 py-1 text-green-700'
              : 'rounded bg-gray-400/20 px-2 py-1 text-gray-700'
          }
        >
          {info.getValue()}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const headerProps = (h) =>
    h.column.getCanSort()
      ? {
          className: 'cursor-pointer select-none',
          onClick: h.column.getToggleSortingHandler(),
        }
      : {};

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (!data.length) return <p className="p-4">No jobs match.</p>;

  return (
    <table className="min-w-full border text-sm">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th
                key={h.id}
                {...headerProps(h)}
                className="px-3 py-2 text-left font-medium"
              >
                {flexRender(h.column.columnDef.header, h.getContext())}
                {h.column.getIsSorted() === 'asc'
                  ? ' ▲'
                  : h.column.getIsSorted() === 'desc'
                  ? ' ▼'
                  : ''}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="odd:bg-gray-50 hover:bg-rose-50">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-3 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
