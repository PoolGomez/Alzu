"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"
import { RoleColumns } from "./columns"

export const columns_mobile: ColumnDef<RoleColumns>[] = [
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    // {
    //     accessorKey: "updatedAt",
    //     header: ({column}) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Ult. Modificación
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     }
    //   },
  {
    id:"actions",
    cell: ({row}) => <div className="text-right"><CellAction data={row.original} /> </div>
  }
]