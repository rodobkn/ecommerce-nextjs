"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition  } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { FormError } from "@/components/errors/form-error";
import { LoginType } from "@/validation-types/auth-types";
import { login } from "@/actions/auth/login";

export const LoginForm = () => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginType>>({
    resolver: zodResolver(LoginType),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = (values: z.infer<typeof LoginType>) => {
    setError("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          }
        })
        .catch((error) => {
          setError("Credenciales Invalidas o te registraste con google/github o algo salió mal")
        })
    })
  }

  return (
    <AuthCardWrapper
      headerLabel="♻️ My Ecommerce"
      headerDescription="Iniciar Sesion"
      switchButtonLabel="¿No tienes cuenta?"
      switchButtonHref="/auth/register"
      showSocial={true}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="juanito@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  )

}