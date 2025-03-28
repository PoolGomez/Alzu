"use client"

import { useParams, useRouter } from "next/navigation"
import { RoleColumns } from "./columns"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreVertical, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { AlertModal } from "@/components/modal/alert-modal"
import { deleteCompanyRoleAction } from "@/actions/company-role-action"

interface CellActionProps{
    data: RoleColumns
}
export const CellAction = ({data}:CellActionProps) => {

    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Id. de rol copiado al portapapeles")
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteCompanyRoleAction(data.id, params.companyId as string)
            toast.success("Rol Elimiado");
            location.reload()
            router.push(`/alzu/${params.companyId}/roles`);
        } catch (error) {
            console.log(error);
          toast.error("Algo salió mal");
        } finally {
          setIsLoading(false);
          setOpen(false);
        }
      };


    return (
        <>
        <AlertModal
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            loading={isLoading}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant={"ghost"}>
                    <span className="sr-only">Open</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acción</DropdownMenuLabel>

                <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Id
                </DropdownMenuItem>

                <DropdownMenuItem onClick={()=> router.push(`/alzu/${params.companyId}/roles/${data.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                </DropdownMenuItem>

                <DropdownMenuItem onClick={()=> setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Eliminar
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}