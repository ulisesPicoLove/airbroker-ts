import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectMongo } from "@/lib/db/mongoose";
import User from "@/lib/models/user";
import { apiAirsite } from "@/lib/api";

declare module "next-auth" {
  interface User {
    name?: string;
    username?: string;
    email?: string;
    apiToken?: string;
  }

  interface Session {
    name?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    apiToken?: string | undefined;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string;
    username?: string;
    email?: string;
    apiToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        username: {},
      },
      async authorize(credentials) {
        await connectMongo();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) return null;

        const isMatch = await user.matchPassword(credentials?.password);

        if (!isMatch) return null;

        const apiToken = await apiAirsite.post("/login", {
          email: credentials?.email,
          password: credentials?.password,
        });

        if (apiToken.status !== 200 && apiToken.status !== 201) return null;

        user.apiToken = apiToken.data.access_token;

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.airtoken = user.apiToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.name = token.name;
      session.username = token.username;
      session.email = token.email;
      session.apiToken = token.apiToken;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return "/dashboard";
      return baseUrl;
    },
  },
};
