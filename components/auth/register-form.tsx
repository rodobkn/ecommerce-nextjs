"use client";

import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";

export const RegisterForm = () => {

  return (
    <AuthCardWrapper
      headerLabel="♻️ My Ecommerce"
      headerDescription="¡Regístrate y Compra!"
      switchButtonLabel="¿Ya tienes Cuenta?"
      switchButtonHref="/auth/login"
      showSocial={true}
    >
      <div>Children Register Placeholder</div>
    </AuthCardWrapper>
  )

}
