import { connectToDB } from "@/utils/database";
import Vote from "@/models/vote";
import Poll from "@/models/poll";

export async function GET() {
  try {
    await connectToDB();

    // Aktif anketi bul
    const activePoll = await Poll.findOne({ status: "active" });
    if (!activePoll) {
      return new Response(JSON.stringify({ error: "Aktif anket bulunamadı" }), {
        status: 404,
      });
    }

    // Tüm oyları say
    const votes = await Vote.aggregate([
      { $match: { poll_id: activePoll._id } },
      { $group: { _id: "$option", count: { $sum: 1 } } },
    ]);

    // Sonuçları uygun formata çevir
    const voteCounts = votes.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return new Response(JSON.stringify(voteCounts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), {
      status: 500,
    });
  }
}
