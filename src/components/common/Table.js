function Th({ title }) {
  return <th className="h-12 px-4 align-middle">{title}</th>;
}

function Td({ data }) {
  return <td className="p-4 text-slate-600">{data}</td>;
}

export default function Table({ header, rows }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-md h-16 border-b border-slate-200 bg-[#714b67] font-medium text-slate-100">
            <tr>
              {header.map((header) => (
                <Th key={header} title={header} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No data available
                </td>
              </tr>
            ) : (
              <tr className="transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100">
                {rows.map((row, rowIndex) =>
                  Object.values(row).map((item, colIndex) => (
                    <Td key={`${rowIndex}-${colIndex}`} data={item} />
                  ))
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
