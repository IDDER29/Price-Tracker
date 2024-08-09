import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongoose";
import UserDb from "../../../../lib/models/user.model";

import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt
export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          // Connect to the database
          await connectToDB(); // Ensure this function is properly defined

          // Find the user
          const user = await UserDb.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }

          // Verify password
          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isMatch) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
};
