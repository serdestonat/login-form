import { connectToDB } from "@/utils/database";
import Vote from "@/models/vote";
import Poll from "@/models/poll";
import User from "@/models/user"; // User modelini import et

export async function POST(request) {
  try {
    const { user_id, button } = await request.json();

    console.log("Gelen user_id:", user_id); // Gelen user_id'yi kontrol edin
    console.log("Gelen button:", button); // Gelen button değerini kontrol edin

    await connectToDB();

    // Kullanıcıyı e-posta ile bul
    const user = await User.findOne({ email: user_id });
    if (!user) {
      console.error("Kullanıcı bulunamadı:", user_id);
      return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı." }), {
        status: 404,
      });
    }

    // Aktif anketi bul
    const activePoll = await Poll.findOne({ status: "active" });
    if (!activePoll) {
      console.error("Aktif anket bulunamadı.");
      return new Response(
        JSON.stringify({ error: "Aktif anket bulunamadı." }),
        {
          status: 404, // Aktif anket bulunamadığında 404 döndür
        }
      );
    }

    // Son 5 dakikada oy kullanmış mı kontrol et
    const lastVote = await Vote.findOne({
      user_id: user_id, // user_id String olarak kullanılıyor
      vote_date: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (lastVote) {
      console.error("Kullanıcı zaten son 5 dakikada oy kullanmış:", user_id);
      return new Response(
        JSON.stringify({ error: "5 dakikada bir oy kullanabilirsiniz." }),
        { status: 400 }
      );
    }

    // Yeni oyu kaydet
    const newVote = new Vote({
      poll_id: activePoll._id,
      user_id: user_id, // user_id String olarak kullanılıyor
      option: button, // option String olarak kullanılıyor
    });

    await newVote.save();
    console.log("Oy başarıyla kaydedildi:", newVote);
    return new Response(JSON.stringify({ message: "Oyunuz kaydedildi." }), {
      status: 201,
    });
  } catch (error) {
    console.error("API hatası:", error);
    return new Response(
      JSON.stringify({ error: "Sunucu hatası. Lütfen tekrar deneyin." }),
      { status: 500 }
    );
  }
}
