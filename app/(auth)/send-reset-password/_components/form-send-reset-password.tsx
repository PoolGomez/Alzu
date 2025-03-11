"use client";
import { sendResetPasswordSchema } from "@/lib/zod";
// import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
import { sendEmailResetPasswordAction } from "@/actions/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCaptchaToken } from "@/lib/captcha";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";


const FormSendResetPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [timeLeft, setTimeLeft] = useState(0);
  const [disabled, setDisabled] = useState(false);
  // const router = useRouter();

  const form = useForm<z.infer<typeof sendResetPasswordSchema>>({
    resolver: zodResolver(sendResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  //begin timer
  // const handleClick = () => {
    
  //   setDisabled(true);
  //   setTimeLeft(90); // Tiempo en segundos
  // };
  useEffect(() => {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setDisabled(false);
      }
    }, [timeLeft]);
    //end timer

  async function onSubmit(values: z.infer<typeof sendResetPasswordSchema>) {
    setError(null);
    startTransition(async () => {

      const token = await getCaptchaToken()
      const response = await sendEmailResetPasswordAction(values, token);
      if (response.error) {
        setError(response.error);
      } else{
        toast.success("Email enviado correctamente")
      }

      //timer
      setDisabled(true);
      setTimeLeft(90); // Tiempo en segundos

    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingrese su correo electrónico para enviar el correo de restablecimiento de contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="ingrese correo electrónico" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <FormMessage>{error}</FormMessage>}
                {/* <TimerButton /> */}
                <Button type="submit" disabled={(isPending || disabled)} className="w-full">
                  {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>}
                  {disabled ? `Espera ${timeLeft}s` : "Enviar Correo"}
                  {/* Enviar Correo */}
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

export default FormSendResetPassword;
