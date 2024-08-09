import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "EX: 12349...",
        },
      },

      async authorize(credentials) {
        const user = { id: "42", name: "Idder", password: "nextAuth" };

        if (
          credentials?.username === user.name &&
          credentials.password === user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
