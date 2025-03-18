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

    async signIn({ profile }) {
      try {
        await connectToDB();

        // Kullanıcıyı veritabanında ara
        const existingUser = await User.findOne({ email: profile.email });

        // Eğer kullanıcı yoksa, yeni bir kullanıcı oluştur
        if (!existingUser) {
          await User.create({
            name: profile.name,
            email: profile.email,
          });
        }
        return true;
      } catch (e) {
        console.error("google sign-in error:", e);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
