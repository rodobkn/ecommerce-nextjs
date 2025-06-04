import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import db from "@/clients/db";
import { User, RegistrationMethod  } from "@/schema/user";
import { LoginType } from "@/validation-types/auth-types";
import { handleOauthUserLogin } from "@/utils/server/auth/handle-oauth-user-login";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = LoginType.safeParse(credentials);

        if (validateFields.success) {
          const email = (credentials.email as string).toLowerCase();
          const password = credentials.password as string;
          const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
          if (userSnapshot.empty) {
            return null;
          }

          const userDoc = userSnapshot.docs[0];
          const user = userDoc.data() as User;

          // Verificar si el usuario es de Oauth
          if (
            user.registrationMethod === RegistrationMethod.GITHUB ||
            user.registrationMethod === RegistrationMethod.GOOGLE
          ) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
          if (!isPasswordValid) {
            return null;
          }

          return { id: user.id, email: user.email, name: user.name }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {

      if (account?.provider === "github") {
        if (user?.email) {
          let githubUsername = user.email.split("@")[0]
          if (user?.name) {
            githubUsername = user.name
          }
          await handleOauthUserLogin(user.email, githubUsername, RegistrationMethod.GITHUB)
        } else {
          return false;
        }
      }

      if (account?.provider === "google") {
        if (user?.email) {
          let googleUsername = user.email.split("@")[0]
          if (user?.name) {
            googleUsername = user.name
          }
          await handleOauthUserLogin(user.email, googleUsername, RegistrationMethod.GOOGLE)
        } else {
          return false;
        }
      }
      
      return true;
    },
  },
  trustHost: true,
})