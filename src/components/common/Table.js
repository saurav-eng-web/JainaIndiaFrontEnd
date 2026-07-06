import Loading from "../customui/Loading";

const sizeMap = {
  xxs: "w-10 max-w-[5rem]", // 80px
  xs: "w-20 max-w-[5rem]", // 80px
  sm: "w-28 max-w-[7rem]", // 112px
  md: "w-36 max-w-[9rem]", // 144px
  lg: "w-48 max-w-[12rem]", // 192px
  xl: "w-64 max-w-[16rem]", // 256px
  xxl: "w-80 max-w-[20rem]", // 320px
  xxxl: "w-96 max-w-[24rem]", // 384px replacing w-lg with valid w-96
  full: "",
};

export default function Table({ columns, rows, isLoading = false, onRowClick }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="h-12 truncate border-b border-slate-200 bg-[#714b67] text-slate-100">
            <tr>
              {columns.map((col) => (
                <Th
                  key={col.key}
                  title={col.label}
                  sizeClass={sizeMap[col.size] || sizeMap.md}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-10">
                  <div className="flex h-full w-full items-center justify-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-10 text-center text-slate-500">
                  No data
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`transition-colors hover:bg-slate-100 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <Td
                      key={col.key}
                      data={row[col.key]}
                      row={row} // Pass the full row for complex renders (like Name)
                      rowIndex={rowIndex}
                      render={col.render}
                      sizeClass={sizeMap[col.size] || sizeMap.md}
                    />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Td({ data, sizeClass, render, row, rowIndex }) {
  return (
    <td
      className={`px-2 py-4 align-top wrap-break-word whitespace-normal text-slate-600 ${sizeClass || ""} `}
    >
      {render ? render(data, row, rowIndex) : data || "-"}
    </td>
  );
}

function Th({ title, sizeClass }) {
  return (
    <th
      className={`h-12 truncate px-2 py-2 text-left text-[14px] font-semibold whitespace-nowrap ${sizeClass || ""} `}
    >
      {title}
    </th>
  );
}

/*
const columnConfig = [
  { label: "Username", key: "Name", size: "sm" }, // Label is "Username", but look for "Name" in data
  { label: "Email", key: "Email", size: "xl" },
  { label: "Phone", key: "Phone", size: "md" },
  { label: "Category", key: "Test", size: "xs" },
  { label: "Status", key: "New", size: "sm" },
];

const rows = [
  {
    Name: "test1",
    Email: "test1@gmail.com",
    Phone: "1234",
    Test: "Admin",
    New: "Active",
  },
  {
    Name: "test2",
    Email: "test2@gmail.com",
    Phone: "5678",
    Test: "User",
    New: "Pending",
  },
];
 */
