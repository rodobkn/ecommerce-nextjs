import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/clients/db";
import { User, RegistrationMethod  } from "@/schema/user";
import { LoginType } from "@/validation-types/auth-types";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = LoginType.safeParse(credentials);

        if (validateFields.success) {
          const email = credentials.email as string;
          const password = credentials.password as string;
          const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
          if (userSnapshot.empty) {
            return null;
          }

          const userDoc = userSnapshot.docs[0];
          const user = userDoc.data() as User;

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
})