import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectMongo } from "@/lib/db/mongoose";
import User from "@/lib/models/user";
import { apiAirsite } from "@/lib/api";

type Credentials {
  email: string;
  password: string;
}

type ExtendedUser = {
  name: string,
  username: string,
  apiToken: string,
}

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) return null;
        await connectMongo();
        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        const isMatch = await user.matchPassword(credentials.password);

        if (!isMatch) return null;

        const apiToken = await apiAirsite.post("/login", {
          email: credentials.email,
          password: credentials.password,
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
