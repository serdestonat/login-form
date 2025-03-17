import user from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    connectToDB();
    const { name, email, password } = await request.json();
    const UserExistense = await user.findOne({ email });
    if (UserExistense) {
      return NextResponse.json({ error: "User already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();

    return NextResponse.json({ message: "User registered", status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Error in Server", status: 500 });
  }
}
