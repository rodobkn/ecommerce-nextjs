import * as z from "zod";

export const LoginType = z.object({
  email: z.string().email({
    message: "Ingrese un email valido",
  }),
  password: z.string().min(1, {
    message: "Ingrese una contraseña"
  })
})

export const RegisterType = z.object({
  email: z.string().email({
    message: "Ingrese un email valido"
  }),
  password: z.string().min(6, {
    message: "La contraseña requiere 6 caracteres como minimo"
  }),
  name: z.string().min(1, {
    message: "Nombre es requerido"
  })
})

