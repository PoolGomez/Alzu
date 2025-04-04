"use client";

import { createPresentationAction } from "@/actions/presentation-actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { ArrowLeftCircleIcon, LoaderCircle, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Campo obligatorio"),
  description: z.string().min(1, "Campo obligatorio"),
  isAvailable: z.boolean(),
  categoryId: z.string().min(1, "Campo obligatorio"),
  companyId: z.string().min(1),
});

interface CreateProductFormProps {
  categories: Category[];
}

export const CreatePresentationForm = ({
  categories,
}: CreateProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isAvailable: true,
      categoryId: "",
      companyId: params.companyId as string,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await createPresentationAction(
        data.name,
        data.description,
        data.isAvailable,
        data.categoryId,
        data.companyId
      );

      toast.success("Presentación creada correctamente");
      setIsLoading(false);
      router.push(`/alzu/${params.companyId}/presentations`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Algo salió mal");
      }
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/alzu/${params.companyId}/presentations`);
      }, 2000);
    }
  };

  const handleClickBack = () => {
    router.push(`/alzu/${params.companyId}/presentations`);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading
          title={"Nueva Presentación"}
          description={"Crear una nueva presentación"}
        />
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese una descripción"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                Descripción referencial de la presentación
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione una categoria"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      Esta presentación estará disponible
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
                Crear Presentación
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
