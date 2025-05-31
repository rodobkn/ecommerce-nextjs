import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();
  if (session && session.user && session.user.email) {
    redirect("/");
  }

  return (
    <RegisterForm />
  )
}

export default RegisterPage;