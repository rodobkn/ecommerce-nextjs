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
import { register } from "@/actions/auth/register";
import { RegisterType } from "@/validation-types/auth-types";

export const RegisterForm = () => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterType>>({
    resolver: zodResolver(RegisterType),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterType>) => {
    setError("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          }
        })
        .catch((error) => {
          setError("Algo salio mal")
        })
    })
  }


  return (
    <AuthCardWrapper
      headerLabel="♻️ My Ecommerce"
      headerDescription="¡Regístrate y Compra!"
      switchButtonLabel="¿Ya tienes Cuenta?"
      switchButtonHref="/auth/login"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="juanito"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            Registrar Cuenta
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  )

}
