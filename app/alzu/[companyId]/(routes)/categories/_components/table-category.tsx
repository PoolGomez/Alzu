"use client";
import { useState } from "react";
import { CellAction } from "./cell-action";
import { CategoryColumns } from "./columns";
import { ArrowDownAZ, ArrowDownUp, ArrowDownZA} from "lucide-react";

const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} className="bg-yellow-500">
        {part}
      </span>
    ) : (
      part
    )
  );
};

interface TableCategoryProps {
  isOwner: boolean;
  isEdit: boolean;
  isDelete: boolean;
  data: CategoryColumns[];
}

const TableCategory = ({
  isOwner,
  isEdit,
  isDelete,
  data,
}: TableCategoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [sortField, setSortField] = useState<keyof CategoryColumns | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof CategoryColumns) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedCategories = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField as keyof CategoryColumns].toString().toLowerCase();
    const valueB = b[sortField as keyof CategoryColumns].toString().toLowerCase();
    return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const filteredCategories = sortedCategories.filter((category) =>
    Object.values(category).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getSortIcon = (field: keyof CategoryColumns) => {
    if (sortField !== field) return <ArrowDownUp className="inline ml-2 h-5 w-5" />;
    return sortOrder === "asc" ? <ArrowDownAZ className="inline ml-2 h-5 w-5" /> : <ArrowDownZA className="inline ml-2 h-5 w-5" />;
  };

  return (
    <div className="w-full mx-auto p-0">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-white-foreground shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent border-b">
              <th className="flex items-center justify-start p-3 black-foreground cursor-pointer" onClick={() => handleSort("name")}>Nombre {getSortIcon("name")}</th>
              <th className="p-3 text-black-foreground hidden md:table-cell cursor-pointer" onClick={() => handleSort("description")}>
                Descripción {getSortIcon("description")}
              </th>
              <th className="p-3 text-black-foreground text-right md:table-cell">
                {(isEdit || isDelete || isOwner) && "Acciones"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-accent">
                <td className="p-3 font-medium text-black-foreground">
                  {highlightText(category.name, searchTerm)}
                </td>
                <td className="p-3 text-black-foreground hidden md:table-cell">
                  {highlightText(category.description, searchTerm)}
                </td>
                <td className="p-0 text-black-foreground text-right px-4">
                  <CellAction
                    id={category.id}
                    isOwner={isOwner}
                    isEdit={isEdit}
                    isDelete={isDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCategory;
