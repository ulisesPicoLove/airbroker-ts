import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectMongo } from "@/lib/db/mongoose";
import User from "@/lib/models/user";
import { apiAirsite } from "@/lib/api";

type Credentials = {
  email: string;
  password: string;
};

type Credenciales = {
  username: string;
  password: string;
};

type ExtendedUser = Credentials & {
  name: string;
  apiToken: string;
};

declare module "next-auth" {
  interface Session {
    name?: string;
    username?: string;
    email?: string;
    airtoken?: string;
  }

  interface JWT {
    name?: string;
    username?: string;
    email?: string;
    airtoken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        name: { label: "Username", type: "text", placeholder: "jsmith" },
        apiToken: { label: "Username", type: "text", placeholder: "jsmith" },
        // email: { label: "email", type: "email" },
      },
      async authorize(credentials: ) {
        if (!credentials) return null;
        await connectMongo();
        const user = await User.findOne({ email: (await credentials).email });

        if (!user) return null;

        const isMatch = await user.matchPassword((await credentials).password);

        if (!isMatch) return null;

        const apiToken = await apiAirsite.post("/login", {
          email: (await credentials).email,
          password: (await credentials).password,
        });

        if (apiToken.status !== 200 && apiToken.status !== 201) return null;

        return {
          name: user.name,
          username: user.username,
          email: user.email,
          apiToken: apiToken.data.access_token,
        };
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
      session.airtoken = token.airtoken;

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
