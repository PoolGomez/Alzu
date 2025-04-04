"use client";

import { useState } from "react";
import { ProductColumns } from "./columns";
import { ArrowDownAZ, ArrowDownUp, ArrowDownZA } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";
import { formatPrice } from "@/lib/format-price";
import { useIsMobile } from "@/hooks/use-mobile";
import { CellActionMobile } from "./cell-action-mobile";

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

interface TableProductProps {
  isOwner: boolean;
  isEdit: boolean;
  isDelete: boolean;
  data: ProductColumns[];
}

const ProductTable = ({
  isOwner,
  isEdit,
  isDelete,
  data,
}: TableProductProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ProductColumns | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const isMobile = useIsMobile();

  const handleSort = (field: keyof ProductColumns) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const sortedProducts = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField as keyof ProductColumns]
      .toString()
      .toLowerCase();
    const valueB = b[sortField as keyof ProductColumns]
      .toString()
      .toLowerCase();
    return sortOrder === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const filteredProducts = sortedProducts.filter((product) =>
    Object.values(product).some((value) =>
      typeof value === "boolean"
        ? value === true
          ? "disponible".includes(searchTerm.toLowerCase())
          : "desactivado".includes(searchTerm.toLowerCase())
        : value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getSortIcon = (field: keyof ProductColumns) => {
    if (sortField !== field)
      return <ArrowDownUp className="inline ml-2 h-5 w-5" />;
    return sortOrder === "asc" ? (
      <ArrowDownAZ className="inline ml-2 h-5 w-5" />
    ) : (
      <ArrowDownZA className="inline ml-2 h-5 w-5" />
    );
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

      {isMobile ? (
        <>
          <div className="flex flex-col space-y-2">
            {filteredProducts.map((product) => (
              <CellActionMobile
                key={product.id}
                id={product.id}
                isOwner={isOwner}
                isEdit={isEdit}
                isDelete={isDelete}
              >
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-md"
                >
                  {/* Parte izquierda: Nombre y Categoría */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {highlightText(product.name, searchTerm)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {highlightText(product.categoryName, searchTerm)}
                    </span>
                  </div>
                  {/* Parte derecha: Precio y Estado */}
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold">
                      {highlightText(formatPrice(product.price).toString(), searchTerm)}
                    </span>
                    <span
                      className={`text-sm ${
                        product.isAvailable === true
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {product.isAvailable === true
                        ? highlightText("Disponible", searchTerm)
                        : highlightText("Desactivado", searchTerm)}
                    </span>
                  </div>
                </div>
              </CellActionMobile>
            ))}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto bg-white-foreground shadow-md rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-accent border-b">
                <th
                  className="items-center justify-start p-3 text-black-foreground cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Nombre {getSortIcon("name")}
                </th>
                <th
                  className="items-center justify-start p-3 text-black-foreground cursor-pointer"
                  onClick={() => handleSort("categoryName")}
                >
                  Categoria {getSortIcon("categoryName")}
                </th>
                <th
                  className=" items-center justify-start p-3 text-black-foreground cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Precio {getSortIcon("price")}
                </th>
                <th
                  className=" items-center justify-start p-3 text-black-foreground cursor-pointer"
                  onClick={() => handleSort("isAvailable")}
                >
                  Estado {getSortIcon("isAvailable")}
                </th>
                <th className="p-3 text-black-foreground text-right md:table-cell">
                  {(isEdit || isDelete || isOwner) && "Acciones"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-accent">
                  <td className="p-3 text-black-foreground">
                    {highlightText(product.name, searchTerm)}
                  </td>
                  <td className="p-3 text-black-foreground hidden md:table-cell">
                    {highlightText(product.categoryName, searchTerm)}
                  </td>
                  <td className="p-3 text-black-foreground hidden md:table-cell">
                    {highlightText(
                      formatPrice(product.price).toString(),
                      searchTerm
                    )}
                  </td>
                  <td className="p-3 text-black-foreground hidden md:table-cell">
                    {product.isAvailable ? (
                      <Badge>{highlightText("Disponible", searchTerm)}</Badge>
                    ) : (
                      <Badge variant="destructive">
                        {highlightText("Desactivado", searchTerm)}
                      </Badge>
                    )}
                  </td>
                  <td className="p-0 text-black-foreground text-right px-4">
                    <CellAction
                      id={product.id}
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
      )}
    </div>
  );
};

export default ProductTable;
