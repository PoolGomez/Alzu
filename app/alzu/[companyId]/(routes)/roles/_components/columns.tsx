"use client"

import { Button } from "@/components/ui/button"
import { PermissionAction } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"

export type RoleColumns = {
    id: string,
    name: string,
    description: string,
    permissions: PermissionAction[],
    createdAt: string,
}

export const columns: ColumnDef<RoleColumns>[] = [
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
  
  {
    accessorKey: "description",
    header: ({column}) => {
        return (
            <Button
                variant="ghost"
                onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Descripción
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({column}) => {
        return (
            <Button
                variant="ghost"
                onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Fecha Creación
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({column}) => {
        return (
            <Button
                variant="ghost"
                onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Ultima Modificación
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    }
  },
  {
    id:"actions",
    cell: ({row}) => <div className="text-right"><CellAction data={row.original} /></div>
  }
]