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
import { ArrowLeftCircleIcon, LoaderCircle, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { permissionsOptions } from "../../_components/permissions-options";
import { formSchemaRole } from "../../_components/schema-role";
import { useIsMobile } from "@/hooks/use-mobile";

const CreateRoleForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const params = useParams();
    const isMobile = useIsMobile();

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
    const handleClickBack = () => {
      router.push(`/alzu/${params.companyId}/roles`);
    };


  return (
    <>
    <div className="flex items-center justify-center">
        <Heading title="Nuevo Rol" description="Agregar un nuevo Rol" />
        <ArrowLeftCircleIcon
          className={` ${
            isMobile ? "mx-2 w-8 h-8" : "mx-4 w-12 h-12"
          } cursor-pointer `}
          onClick={() => handleClickBack()}
        />
    </div>
    <Separator />
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
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

        <div className="flex items-center justify-center gap-8 sm:px-8">
            <Button disabled={isLoading} type="submit" size={"sm"} className={`${isMobile && "w-full"}`}>
              {isLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
              ):(
                <Save className="mr-2 h-4 w-4 " />
              )}
              Crear Rol
            </Button>
            </div>

        </div>
       
        </form>
      </Form>
    </>
  )
}

export default CreateRoleForm
