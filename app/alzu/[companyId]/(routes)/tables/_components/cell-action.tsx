"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, LoaderCircle, MoreVertical, Save, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modal/alert-modal";
import { Modal } from "@/components/modal";
import { deleteDeleteByIdAction, updateTableAction } from "@/actions/table-actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CellActionProps {
  id: string;
  table: Table;
  isEdit: boolean;
  isDelete: boolean;
  isOwner: boolean;
  handleSelectRoom: (params: string) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Campo obligatorio").max(7,"Caracteres max. permimtidos 7"),
  isAvailable: z.boolean(),
});

export const CellAction = ({
  id,
  table,
  isEdit,
  isDelete,
  isOwner,
  handleSelectRoom,
}: CellActionProps) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [isModalEditTable, setIsModalEditModal] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID de mesa copiado en el portapapeles");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      //   await deleteCategoryByIdAction(id, params.companyId as string);
      await deleteDeleteByIdAction(id, params.companyId as string);
      toast.success("Mesa Eliminado");
      setIsLoading(false);
      setOpen(false);
      // location.reload();
      handleSelectRoom(searchParams.get("room") as string);
      // router.push(`/alzu/${params.companyId}/tables`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Algo salió mal");
      }

      setIsLoading(false);
      setOpen(false);

      setTimeout(() => {
        location.reload();
        router.push(`/alzu/${params.companyId}/tables`);
      }, 2000); // 2000 ms = 2 segundos (ajusta este valor si cambias la duración del toast)
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: table.name,
        isAvailable: table.isAvailable,
      },
    });

    const onSubmitUpdate = async (data: z.infer<typeof formSchema>) => {
      try {
          setIsLoading(true);
    
          await updateTableAction(table.id, data.name, data.isAvailable, params.companyId as string)
           
          toast.success("Mesa actualizada");
          handleSelectRoom(searchParams.get("room") as string);
    
        } catch (error) {
          if( error instanceof Error){
            toast.error(error.message);
          }else{
              toast.error("Something went wrong");
          }
        } finally {
          setIsLoading(false);
          setIsModalEditModal(false)
          router.refresh();
        }
  }


  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />

      <Modal
        title="Editar Mesa"
        description="Configurar datos de la mesa"
        isOpen={isModalEditTable}
        onClose={() => setIsModalEditModal(false)}
      >
        {/* MODAL EDITAR */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="w-full space-y-8"
          >
            <div className="grid grid-cols-1 gap-8 sm:p-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Ingrese un nombre"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Disponible</FormLabel>
                      <FormDescription>
                        Esta mesa estará disponible
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center gap-8 sm:px-8">
                <Button
                  disabled={isLoading}
                  type="submit"
                  size={"sm"}
                  // className={`${isMobile && "w-full"}`}
                  className="w-full"
                >
                  {isLoading ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4 " />
                  )}
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </form>
        </Form>



      </Modal>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 " variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => onCopy(id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar Id
          </DropdownMenuItem>
          {(isOwner || isEdit) && (
            <DropdownMenuItem
              onClick={() =>
                // router.push(`/alzu/${params.companyId}/tables/${id}`)
                
                  setIsModalEditModal(true)
                
                
              }
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
          )}
          {(isOwner || isDelete) && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Borrar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
