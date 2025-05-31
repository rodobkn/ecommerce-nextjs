import "server-only";
import db from "@/clients/db";
import { User, RegistrationMethod } from "@/schema/user";

export const handleOauthUserLogin = async (email: string, name: string, registrationMethod: RegistrationMethod) => {
  const userSnapshot = await db.collection("users").where("email", "==", email).get();

  // Si el email NO esta en la base de datos lo registramos
  if (userSnapshot.empty) {
    const newUser: User = {
      id: "",
      email,
      name,
      hashedPassword: `${registrationMethod}-oauth`,
      registrationMethod,
      cart: [],
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const userRef = db.collection("users").doc();
    newUser.id = userRef.id;
    await userRef.set(newUser);
  };
}
