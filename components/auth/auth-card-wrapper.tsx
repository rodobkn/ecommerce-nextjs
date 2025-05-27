"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { SwitchButton } from "@/components/auth/switch-button";

interface AuthCardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerDescription: string;
  switchButtonLabel: string;
  switchButtonHref: string;
  showSocial?: boolean;
}

export const AuthCardWrapper = ({
  children,
  headerLabel,
  headerDescription,
  switchButtonLabel,
  switchButtonHref,
  showSocial,
}: AuthCardWrapperProps) => {
  return (
    <Card className="w-[350px] md:w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} description={headerDescription} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <SwitchButton
          label={switchButtonLabel}
          href={switchButtonHref}
        />
      </CardFooter>
    </Card>
  )
}
