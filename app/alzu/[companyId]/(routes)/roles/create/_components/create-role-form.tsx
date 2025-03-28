"use client"

import { createCompanyRoleAction } from "@/actions/company-role-action";
import { Heading } from "@/app/alzu/_components/heading"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { PermissionAction } from "@prisma/client";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { permissionsOptions } from "../../_components/permissions-options";
import { formSchemaRole } from "../../_components/schema-role";

// const permissionsOptions= [
//     { id: 'VIEW_DASHBOARD', label: 'Ver Dashboard' },

//     { id: 'VIEW_PRODUCTS', label: 'Ver Productos' },
//     { id: 'CREATE_PRODUCT', label: 'Crear Producto' },
//     { id: 'EDIT_PRODUCT', label: 'Editar Producto' },
//     { id: 'DELETE_PRODUCT', label: 'Eliminar Producto' },

//     { id: 'VIEW_CATEGORIES', label: 'Ver Categorías' },
//     { id: 'CREATE_CATEGORY', label: 'Crear Categoría' },
//     { id: 'EDIT_CATEGORY', label: 'Editar Categoría' },
//     { id: 'DELETE_CATEGORY', label: 'Eliminar Categoría' },

//     { id: 'VIEW_PRESENTATIONS', label: 'Ver Presentaciones' },
//     { id: 'CREATE_PRESENTATION', label: 'Crear Presentación' },
//     { id: 'EDIT_PRESENTATION', label: 'Editar Presentación' },
//     { id: 'DELETE_PRESENTATION', label: 'Eliminar Presentación' },

//     { id: 'VIEW_ORDERS', label: 'Ver Ordenes' },
//     { id: 'CREATE_ORDER', label: 'Crear Orden' },
//     { id: 'EDIT_ORDER', label: 'Editar Orden' },
//     { id: 'DELETE_ORDER', label: 'Eliminar Orden' },

//     { id: 'VIEW_ROOMS', label: 'Ver Salas' },
//     { id: 'CREATE_ROOM', label: 'Crear Sala' },
//     { id: 'EDIT_ROOM', label: 'Editar Sala' },
//     { id: 'DELETE_ROOM', label: 'Eliminar Sala' },

//     { id: 'VIEW_TABLES', label: 'Ver Mesas' },
//     { id: 'CREATE_TABLE', label: 'Crear Mesa' },
//     { id: 'EDIT_TABLE', label: 'Editar Mesa' },
//     { id: 'DELETE_TABLE', label: 'Eliminar Mesa' },
  
//     { id: 'VIEW_COMPANY', label: 'Ver Empresa' },
//   ];

// const formSchema = z.object({
//   name: z.string().min(1),
//   description: z.string(),
//   permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
//     message: "You have to select at least one item.",
//   }),
// });


const CreateRoleForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const title = "Crear Rol";
    const description = "Agregar un nuevo Rol";
    const router = useRouter()
    const params = useParams();

    const form = useForm<z.infer<typeof formSchemaRole>>({
        resolver: zodResolver(formSchemaRole),
        defaultValues: {
          name: "",
          description: "",
          permissions: [] ,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchemaRole>) => {

        try {
          setIsLoading(true);
          await createCompanyRoleAction(data.name, data.description, data.permissions as PermissionAction[], params.companyId as string)
        
          toast.success("Rol creado correctamente");
          router.push(`/alzu/${params.companyId}/roles`);
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        } finally {
          router.refresh();
          setIsLoading(false);
        }
    };


  return (
    <>
    <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
    </div>
    <Separator />
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-16">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Ingrese un nombre..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Ingrese una descripcion..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Permisos</FormLabel>
                <FormDescription>
                  Seleccione los permisos para este Rol
                </FormDescription>
              </div>
              
              <div className="px-6">
              {permissionsOptions.map((item) => {
                const permissionId = item.id as PermissionAction
              return (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="permissions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-2"
                      >
                        <FormControl>
                          <Checkbox
                            // disabled={item.id==="VIEW_COMPANY" ? true : false}
                            checked={field.value?.includes(permissionId)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              )
              }
            )}
              </div>
              
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
            <Save /> Guardar
        </Button>
        </form>
      </Form>
    </>
  )
}

export default CreateRoleForm
