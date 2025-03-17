import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },

    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        const checkEmail = await user.find({ email: user.email });

        if (checkEmail.length == 0) {
          await user.insertMany({ name: user.name, email: user.email });
          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
