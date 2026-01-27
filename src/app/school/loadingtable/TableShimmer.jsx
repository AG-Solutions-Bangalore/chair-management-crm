import { TableCell, TableRow } from "@/components/ui/table";

export const TableShimmer = ({ columns, rows = 10 }) => {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={index} className="animate-pulse h-11">
      {columns?.map((column) => (
        <TableCell key={column.id} className="py-1 px-3">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </TableCell>
      ))}
    </TableRow>
  ));
};
