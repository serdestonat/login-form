import user from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    connectToDB();
    const { email, password } = await request.json();
    const UserExistense = await user.findOne({ email });
    if (!UserExistense) {
      return NextResponse.json({ error: "User does not exist." });
    }

    const checkPassword = await bcrypt.compare(
      password,
      UserExistense.password
    );

    if (!checkPassword) {
      return NextResponse.json({ error: "Wrong Password", status: 404 });
    }

    return NextResponse.json({
      message: "success",
      status: 201,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, status: 500 });
  }
}
