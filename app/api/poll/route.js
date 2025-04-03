import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";

export async function GET() {
  try {
    await connectToDB();
    const activePoll = await Poll.findOne({ status: "active" });
    return new Response(JSON.stringify({ exists: !!activePoll }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST() {
  try {
    await connectToDB();

    const newPoll = new Poll({
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "active",
    });

    await newPoll.save();
    return new Response(
      JSON.stringify({
        message: "Anket başarıyla oluşturuldu.",
        pollId: newPoll._id,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Anket başlatılamadı." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
