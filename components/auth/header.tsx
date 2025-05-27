"use client";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

interface HeaderProps {
  label: string;
  description: string;
}

export const Header = ({
  label,
  description,
}: HeaderProps) => {
  const router = useRouter();

  const handleClickInHeaderAuthPage = () => {
    router.push("/")
  }

  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1
        className={
          cn(
            "text-3xl font-semibold cursor-pointer",
            font.className
          )
        }
        onClick={handleClickInHeaderAuthPage}
      >
        {label}
      </h1>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  )
}
