import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();
  if (session && session.user && session.user.email) {
    redirect("/");
  }

  return (
    <LoginForm />
  )
}

export default LoginPage;