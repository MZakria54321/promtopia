import { connectDB } from "@utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/users";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
      } catch (error) {
        console.log("Error in session database query:", error);
        return session;
      }
    },
    async signIn({ profile }) {
      try {
        await connectDB();

        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          const newUser = await User.create({
            username: profile.name.replace(" ", "").toLowerCase(),
            email: profile.email,
            image: profile.picture,
          });

          await newUser.save();
        }
        console.log("prfile  : ", profile);
        return true;
      } catch (error) {
        console.log("Error in signIn:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
