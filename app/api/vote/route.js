import { connectToDB } from "@/utils/database";
import Vote from "@/models/vote";
import Poll from "@/models/poll";

// POST metodu için adlandırılmış ihracat
export async function POST(request) {
  try {
    const { user_id, button } = await request.json();

    await connectToDB();

    // Aktif anketi bul
    const activePoll = await Poll.findOne({ status: "active" });
    if (!activePoll) {
      return new Response(
        JSON.stringify({ error: "Aktif anket bulunamadı." }),
        {
          status: 400,
        }
      );
    }

    // Son 5 dakikada oy kullanmış mı kontrol et
    const lastVote = await Vote.findOne({
      user_id,
      vote_date: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (lastVote) {
      return new Response(
        JSON.stringify({ error: "5 dakikada bir oy kullanabilirsiniz." }),
        { status: 400 }
      );
    }

    // Yeni oyu kaydet
    const newVote = new Vote({
      poll_id: activePoll._id,
      user_id,
      option: button,
      vote_date: new Date(),
    });

    await newVote.save();
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

// GET metodu için adlandırılmış ihracat (isteğe bağlı)
export async function GET() {
  try {
    await connectToDB();

    // Örnek: Tüm oyları getir
    const votes = await Vote.find({});
    return new Response(JSON.stringify(votes), { status: 200 });
  } catch (error) {
    console.error("API hatası:", error);
    return new Response(
      JSON.stringify({ error: "Sunucu hatası. Lütfen tekrar deneyin." }),
      { status: 500 }
    );
  }
}
