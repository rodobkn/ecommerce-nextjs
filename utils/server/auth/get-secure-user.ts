import "server-only";
import { auth } from "@/auth";
import db from "@/clients/db";
import { userToSecureUser, SecureUser, User } from "@/schema/user";

export const getSecureUser = async (): Promise<SecureUser | null> => {
  const session = await auth();
  const currentUserEmail = session?.user?.email || null;

  if (!currentUserEmail) {
    return null;
  }

  const userSnapshot = await db
    .collection("users")
    .where("email", "==", currentUserEmail)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0]
  const rawUserData = userDoc.data();
  const userData = {
    ...rawUserData,
    createdAt: rawUserData.createdAt.toDate(),
    updatedAt: rawUserData.updatedAt.toDate(),
  };

  return userToSecureUser(userData as User);
}
