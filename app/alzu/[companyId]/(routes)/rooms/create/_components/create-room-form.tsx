"use client";
import { createRoomAction } from "@/actions/room-actions";
import { Heading } from "@/app/alzu/_components/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftCircleIcon, LoaderCircle, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";


const formSchema = z.object({
  name: z.string().min(1, "Campo obligatorio"),
  isAvailable: z.boolean(),
  companyId: z.string().min(1),
});

export const CreateRoomForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { companyId } = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isAvailable: true,
      companyId: companyId as string,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await createRoomAction(
        data.name,
        data.companyId,
        data.isAvailable
      );

      toast.success("Sala creada correctamente");
      setIsLoading(false);
      router.push(`/alzu/${companyId}/rooms`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Algo salió mal");
      }
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/alzu/${companyId}/rooms`);
      }, 2000);
    }
  };

  const handleClickBack = () => {
    router.push(`/alzu/${companyId}/rooms`);
  };
  

  return (
    <>

      <div className="flex items-center justify-center">
        <Heading title={"Nueva Sala"} description={"Crear una nueva sala"} />
        <ArrowLeftCircleIcon
          className={` ${
            isMobile ? "mx-2 w-8 h-8" : "mx-4 w-12 h-12"
          } cursor-pointer `}
          onClick={() => handleClickBack()}
        />
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full space-y-8"
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
                          Este producto estará disponible
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
              className={`${isMobile && "w-full"}`}
            >
              {isLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4 " />
              )}
              Crear Sala
            </Button>
          </div>


            </div>
          

         

        </form>
      </Form>
    </>
  );
};
