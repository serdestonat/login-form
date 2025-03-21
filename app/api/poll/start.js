import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";

export async function POST(request) {
  try {
    await connectToDB();

    const newPoll = new Poll({
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 hafta sonra
      status: "active",
    });

    await newPoll.save();
    return new Response(
      JSON.stringify({ message: "Yeni anket başlatıldı.", poll: newPoll }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Anket başlatma hatası:", error);
    return new Response(JSON.stringify({ error: "Anket başlatılamadı." }), {
      status: 500,
    });
  }
}
