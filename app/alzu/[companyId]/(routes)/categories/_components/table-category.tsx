"use client";
import { useState } from "react";
import { CellAction } from "./cell-action";
import { CategoryColumns } from "./columns";

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

  const filteredCategories = data.filter((category) =>
    Object.values(category).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
              <th className="p-3 black-foreground">Nombre</th>
              <th className="p-3 text-black-foreground hidden md:table-cell">
                Descripción
              </th>
              <th className="p-3 text-black-foreground text-right">
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
                  {highlightText(category.name, searchTerm)}
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
