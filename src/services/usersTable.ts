import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const users = schema.users;

async function getUserByUsername(username: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return user;
}

async function updateUser(username: string, body: any) {
  const refreshToken = body.refresh_token;
  await db
    .update(users)
    .set({ refresh_token: refreshToken })
    .where(eq(users.username, username));
}

async function createUser(body: any) {
  const username = body.username;
  const password = body.password;
  const email = body.email;

  const emailInDatabase = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  const usernameInDatabase = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  const userExists =
    emailInDatabase.length > 0 || usernameInDatabase.length > 0;
  if (userExists) {
    throw new Error("User already exists");
  }

  const newUser = await db.insert(users).values({
    username: username,
    password: password,
    role: "user",
    email: email,
  });
  return newUser;
}

export { createUser, getUserByUsername, updateUser };
