import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const activePoll = await Poll.findOne({ status: "active" });

    return NextResponse.json({ activePoll });
  } catch (error) {
    console.error("Aktif anket kontrol hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
