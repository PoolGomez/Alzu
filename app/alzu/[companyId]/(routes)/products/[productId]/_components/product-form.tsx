"use client";

import { updateProductAction } from "@/actions/product-actions";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Product } from "@prisma/client";
import axios from "axios";
import { ArrowLeftCircleIcon, LoaderCircle, Save } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ProductFormProps {
  initialData: Product;
  categories: Category[];
}
const urlDomainValid = "https://res.cloudinary.com"
const allowedExtensions = [".jpg",".png",".jpeg"]
const imageInvalid = "/img/no-image.jpg"

const validateImageUrl = async (url: string) => {
  const isValid =
    url.startsWith(urlDomainValid) &&
    allowedExtensions.some((ext) => url.endsWith(ext));

  if (!isValid) return false;

  try {
    const res = await axios.head(url);
    return res.status === 200;
  } catch {
    return false;
  }
};

const formSchema = z.object({
  name: z.string().min(1, "Campo obligatorio"),
  description: z.string().min(1, "Campo obligatorio"),
  imageUrl: z.string().refine( async(url)=>{
    if(!url) return true
    return await validateImageUrl(url)
  },
    {message: "El link no cumple las condiciones establecidas. Ingrese una URL válida",}
  ),
  price: z.coerce
    .number({
      required_error: "Campo obligatorio",
    })
    .min(0, { message: "Valor mínimo permitido es 0" })
    .max(9999999, { message: "Valor máximo permitido es 9,999,999.00" }),
  categoryId: z.string().min(1, "Campo obligatorio"),
  isAvailable: z.boolean(),
});

export const ProductForm = ({ initialData, categories }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { companyId, productId } = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      imageUrl: initialData.imageUrl,
      price: Number(initialData.price / 100),
      categoryId: initialData.categoryId,
      isAvailable: initialData.isAvailable,
    },
  });

  const [imageUrl, setImageUrl] = useState(form.getValues("imageUrl") || "");
  const [preview, setPreview] = useState(imageUrl!=="" ? true : false);
  const [previewUrl, setPreviewUrl] = useState(form.getValues("imageUrl") || imageInvalid);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await updateProductAction(
        productId as string,
        data.name,
        data.description,
        data.imageUrl,
        Math.round(data.price * 100),
        data.isAvailable,
        data.categoryId,
        companyId as string
      );

      toast.success("Producto actualizado correctamente");
      setIsLoading(false);
      router.push(`/alzu/${companyId}/products`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Algo salió mal");
      }
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/alzu/${companyId}/products`);
      }, 2000);
    }
  };

  const handleClickBack = () => {
    router.push(`/alzu/${companyId}/products`);
  };

  const handleClickPreview = async () => {
    try {
      const valid = await validateImageUrl(imageUrl);
      setPreviewUrl(valid ? imageUrl : imageInvalid);
    } catch {
      setPreviewUrl(imageInvalid);
    }
    setPreview(true);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading
          title={"Editar Producto"}
          description={"Modifica los datos del producto"}
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
          className="w-full h-full space-y-8"
        >
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4 gap-y-4 space-y-4">
              <div className="rounded-lg bg-background p-0 sm:p-6 sm:border-1 space-y-4 m-0">
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
                          placeholder="Ingrese una description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
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
                          Este producto estará disponible
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="rounded-lg bg-background p-0 sm:p-6 sm:border-1 space-y-4 m-0">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          disabled={isLoading}
                          placeholder="Ingrese la Url de la imagen"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setImageUrl(e.target.value);
                            setPreview(false);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="text-sm text-gray-600 w-full sm:w-2/3">
                    <p className="mb-1 font-medium">Condiciones:</p>
                    <ul className="list-disc list-inside pb-4">
                      <li>
                        Debe ser un link de una imagen subida en{" "}
                        <a
                          href="https://cloudinary.com"
                          target="_blank"
                          className="text-blue-600"
                        >
                          Cloudinary
                        </a>
                      </li>
                      <li>
                        Formatos permitidos:{" "}
                        <span className="font-medium">.jpg, .jpeg, .png</span>
                      </li>
                    </ul>

                    <Button
                      type="button"
                      disabled={imageUrl === "" ? true : false}
                      onClick={() => handleClickPreview()}
                      className="text-xs"
                    >
                      Previsualizar link de la Imagen
                    </Button>
                  </div>

                  <div className="flex w-full sm:w-32 h-32 rounded-lg border  items-center justify-center">
                    {preview && (
                      <Image
                        src={previewUrl}
                        alt="vista-previa"
                        className="object-cover"
                        width={200}
                        height={200}
                        onError={() => {
                          setPreviewUrl(imageInvalid);
                          setImageUrl(imageInvalid);
                        }}
                      />
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
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
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
