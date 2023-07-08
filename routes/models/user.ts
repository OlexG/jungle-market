import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

// Shared TS type
export interface User {
  id: string;
  name: string;
  email: string;
  icon: string;
}

export const UserDBSchema = z.object({
  id: z.string().uuid().describe("primary, unique"),
  createdAt: z.date().optional(),
  name: z.string(),
  email: z.string(),
  sessionToken: z.string().optional(),
  icon: z.string(),
});

export const userQLString = `
  type User {
    id: ID!
    name: String!
    email: String!
  }
`

export class UserModel implements User {
  id: string
  name: string
  email: string
  icon: string

  constructor(user: any) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.icon = user.icon
  }
}

