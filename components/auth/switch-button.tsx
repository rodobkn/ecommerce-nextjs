"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface SwitchButtonProps {
  href: string;
  label: string;
}

export const SwitchButton = ({
  href,
  label,
}: SwitchButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full"
      size="sm"
      asChild
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
} 
