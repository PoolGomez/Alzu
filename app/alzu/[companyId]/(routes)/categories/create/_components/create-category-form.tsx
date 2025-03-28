"use client"

import { createCategoryAction } from "@/actions/category-actions";
import { Heading } from "@/app/alzu/_components/heading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    companyId: z.string().min(1)
});

export const CreateCategoryForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const isMobile = useIsMobile()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            description:"",
            companyId: params.companyId as string
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            await createCategoryAction(data.name, data.description || null, data.companyId)
          
            toast.success("Categorias creada correctamente");
            setIsLoading(false);
            router.push(`/alzu/${params.companyId}/categories`);
    
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Algo salió mal");
            }
            setTimeout(() => {
                setIsLoading(false);
                router.push(`/alzu/${params.companyId}/categories`);
            }, 2000);
        } 
        // finally {
            
        //     setTimeout(() => {
        //         setIsLoading(false);
        //         router.push(`/alzu/${params.companyId}/categories`);
        //     }, 2000); 
        // }
    };

    const handleClickBack = () => {
        router.push(`/alzu/${params.companyId}/categories`);
      };
    


  return (
    <>
        <div className="flex items-center justify-center">
        <ArrowLeftCircleIcon
          className={` ${
            isMobile ? "mx-2 w-12 h-12" : "mx-4 w-16 h-16"
          } cursor-pointer `}
        //   className={"mx-2 w-12 h-12 sm:mx-4 sm:w-14 sm:h-14 cursor-pointer "}
          onClick={() => handleClickBack()}
        />
        <Heading title={"Crear Categoria"} description={"Crear una nueva categoria"} />
        
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ingrese una description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" size={"sm"}>
            Guardar
          </Button>
          </div>

          
        </form>
      </Form>


    </>
  )
}
