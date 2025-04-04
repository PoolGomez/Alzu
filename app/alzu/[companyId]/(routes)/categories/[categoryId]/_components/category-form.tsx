"use client"

import { updateCategoryAction } from "@/actions/category-actions";
import { Heading } from "@/app/alzu/_components/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { ArrowLeftCircleIcon, LoaderCircle, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
    initialData: Category;
}
const formSchema = z.object({
    name: z.string().min(1, "Campo obligatorio"),
    description: z.string(),
    isAvailable: z.boolean(),
});

  
export const CategoryForm = ({initialData}: CategoryFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const isMobile = useIsMobile();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
      
            await updateCategoryAction(params.categoryId as string, data.name, data.description,data.isAvailable, params.companyId as string)
             
            toast.success("Categoria actualizada");
      
            router.push(`/alzu/${params.companyId}/categories`);
      
          } catch (error) {
            if( error instanceof Error){
              toast.error(error.message);
            }else{
                toast.error("Something went wrong");
            }
          } finally {
            router.refresh();
            setIsLoading(false);
          }
    }

    const handleClickBack = () => {
        router.push(`/alzu/${params.companyId}/categories`);
      };

  return (
    <>
        
        <div className="flex items-center justify-center">
            <Heading title={"Editar Categoria"} description={"Editar una categoria"} />
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ingrese una descripción"
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
                      Esta categoria estará disponible
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-center gap-8 sm:px-8">
            <Button disabled={isLoading} type="submit" size={"sm"} className={`${isMobile && "w-full"}`}>
              {isLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
              ):(
                <Save className="mr-2 h-4 w-4 " />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

