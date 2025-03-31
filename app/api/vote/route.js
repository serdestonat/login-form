import { connectToDB } from "@/utils/database";
import Vote from "@/models/vote";
import Poll from "@/models/poll";
import User from "@/models/user"; // User modelini import et
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB(); // MongoDB bağlantısını sağla

    const body = await req.json();
    const { user_id, button } = body;

    if (!user_id || !button) {
      return NextResponse.json(
        { error: "Kullanıcı ID veya oy bilgisi eksik." },
        { status: 400 }
      );
    }

    console.log("Gelen user_id:", user_id);
    console.log("Gelen oy butonu:", button);

    // Aktif anketi bul
    const activePoll = await Poll.findOne({ status: "active" });
    console.log("Aktif anket:", activePoll);
    if (!activePoll) {
      return NextResponse.json(
        { error: "Aktif anket bulunamadı." },
        { status: 404 }
      );
    }

    // Kullanıcının son oy verme süresini kontrol et (örneğin 5 dakika)
    const lastVote = await Vote.findOne({ user_id }).sort({ createdAt: -1 });
    if (lastVote) {
      const now = new Date();
      const lastVoteTime = new Date(lastVote.createdAt);
      const diffMinutes = (now - lastVoteTime) / (1000 * 60);
      if (diffMinutes < 5) {
        return NextResponse.json(
          { error: "Tekrar oy vermek için beklemelisin." },
          { status: 403 }
        );
      }
    }

    // Yeni oyu kaydet
    const newVote = new Vote({
      poll_id: activePoll._id,
      user_id,
      option: button,
    });
    await newVote.save();

    return NextResponse.json(
      { message: "Oy başarıyla kaydedildi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API hata verdi:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
