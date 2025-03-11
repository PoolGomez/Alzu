"use client";
import { resetPasswordSchema } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/actions/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

interface FormResetPasswordProps {
  token: string;
}

const FormResetPassword = ({token}:FormResetPasswordProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log("onsubmit")
    setError(null);
    startTransition(async () => {
      const response = await resetPasswordAction(values, token);
      console.log(response);
      if (response.error) {
        setError(response.error);
      } 
      else {
        toast.success("Contraseña cambiada")
        router.push("/login");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Restablecer Contraseña</CardTitle>
          <CardDescription>
            Ingrese su nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input placeholder="ingrese nueva contraseña" type="password" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <FormMessage>{error}</FormMessage>}
                <Button type="submit" disabled={isPending} className="w-full">
                  Actualizar contraseña
                </Button>
              </div>

              <div className="mt-2 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Registrate
                </a>
              </div>

              <div className="mt-2 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Inicia sesión
                </a>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormResetPassword;
