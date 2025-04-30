"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoomColumns } from "./columns";
import { Heading } from "@/app/alzu/_components/heading";
import { Table } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  createTableAction,
  getTablesByRoomIdAction,
} from "@/actions/table-actions";
import { ArrowLeftCircleIcon, LoaderCircle, Plus, Save } from "lucide-react";
import ListTable from "./list-table";
import { Modal } from "@/components/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getRoomByIdAction } from "@/actions/room-actions";

interface TableClientProps {
  data: RoomColumns[];
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isOwner: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "Campo obligatorio").max(7,"Caracteres max. permimtidos 7"),
  isAvailable: z.boolean(),
  companyId: z.string().min(1),
});

const TableClient = ({
  data,
  isCreate,
  isEdit,
  isDelete,
  isOwner,
}: TableClientProps) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [roomSelect, setRoomSelect] = useState(
    searchParams.get("room") ? true : false
  );
  const [tables, setTables] = useState<Table[] | null>(null);

  const [isModalCreateTable, setIsModalCreateTable] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [roomName, setRoomName] = useState("")

  useEffect(() => {
    if (searchParams.get("room")) {
      // try {
      handleClickRoomSelect(searchParams.get("room") as string);
      // } catch (error) {
      //   console.log("ERROR USEEFFECT")
      //   if (error instanceof Error) {
      //       toast.error(error.message);
      //   } else {
      //       toast.error("Algo salió mal");
      //   }
      // }
    }
  }, []);

  const handleClickRoomSelect = async (roomId: string) => {
    // setRoomSelect(roomId)

    try {
      setRoomSelect(true);
      const tablesData = await getTablesByRoomIdAction(roomId);
      setTables(tablesData);
      const roomData = await getRoomByIdAction(roomId)
      setRoomName(roomData.name)
      router.push(`/alzu/${params.companyId}/tables?room=${roomId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Algo salió mal");
      }
      setRoomSelect(false);
      router.push(`/alzu/${params.companyId}/tables`);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isAvailable: true,
      companyId: params.companyId as string,
    },
  });

  const onSubmitCreate = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoadingCreate(true);
      if (roomSelect) {
        await createTableAction(
          data.name,
          data.companyId,
          searchParams.get("room") as string,
          data.isAvailable
        );
        toast.success("Mesa creada correctamente");
        setIsLoadingCreate(false);
        await handleClickRoomSelect(searchParams.get("room") as string);
      } else {
        toast.error("No se ha seleccionado una Categoria");
        setIsLoadingCreate(false);
        setRoomSelect(false);
        router.push(`/alzu/${params.companyId}/tables`);
      }
      setIsModalCreateTable(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Algo salió mal");
      }
      setTimeout(() => {
        setIsLoadingCreate(false);
        router.push(`/alzu/${params.companyId}/tables`);
        setIsModalCreateTable(false);
      }, 2000);
    }
  };

  const handleClickBackButton = () => {
    setRoomSelect(false);
    router.push(`/alzu/${params.companyId}/tables`);
  };

  return (
    <>
      <Modal
        title="Crear Mesa"
        description="Configurar datos de la mesa"
        isOpen={isModalCreateTable}
        onClose={() => setIsModalCreateTable(false)}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitCreate)}
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
                        disabled={isLoadingCreate}
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
                        {/* This prodcut will be on home screen under featured
                      products */}
                        Esta mesa estará disponible
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center gap-8 sm:px-8">
                <Button
                  disabled={isLoadingCreate}
                  type="submit"
                  size={"sm"}
                  className={`${isMobile && "w-full"}`}
                >
                  {isLoadingCreate ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4 " />
                  )}
                  Crear Mesa
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>

      {!roomSelect ? (
        <>
          <div className="flex items-center justify-between">
            <Heading title={`Seleccione una Sala`} description="" />
          </div>

          {data.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-md cursor-pointer"
              onClick={() => handleClickRoomSelect(room.id)}
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold ml-8">{room.name}</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">{room.tables.length} mesas</span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Heading 
              // title={`Mesas`} 
              title={`Mesas de ${roomName}`}
              description={"Lista de Mesas"}
            />
            <ArrowLeftCircleIcon
              className={` ${
                isMobile ? "mx-2 w-8 h-8" : "mx-4 w-12 h-12"
              } cursor-pointer `}
              onClick={() => handleClickBackButton()}
            />
          </div>
          {(isCreate || isOwner) && (
            <div
              className="flex items-center justify-between p-4 border rounded-lg shadow-md cursor-pointer"
              // onClick={() => handleClickRoomSelect(room.id)}
              onClick={() => setIsModalCreateTable(true)}
            >
              <div className="flex w-full items-center justify-center">
                <Plus className="mx-2 w-4 h-4" /> Agregar Mesa
              </div>
            </div>
          )}

          <ListTable
            isOwner={isOwner}
            isEdit={isEdit}
            isDelete={isDelete}
            data={tables}
            handleSelectRoom={handleClickRoomSelect}
          />
        </>
      )}

      {/* <div className="flex items-center justify-between">
            <Heading 
                title={`Salas (${data.length})`} 
                description="Gestionar salas para tu empresa"
            />
            {
                (isCreate || isOwner) && (
                    <Button onClick={()=>router.push(`/alzu/${params.companyId}/rooms/create`)} className='cursor-pointer'>
                        <Plus className="h-4 w-4" />
                        {!isMobile && "Crear Sala"}
                    </Button>
                )
            }

        </div>
        <Separator /> */}
      {/* <RoomTable
            isOwner={isOwner}
            isEdit={isEdit}
            isDelete={isDelete}
            data={data}
        /> */}
    </>
  );
};
export default TableClient;
