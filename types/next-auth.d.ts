import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }
}
