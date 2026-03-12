import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        if (credentials.username === "demo" && credentials.password === "demo") {
          return { id: "demo-user", name: "Demo Analyst" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" }
});
