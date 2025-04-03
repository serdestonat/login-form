import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";

export async function GET() {
  try {
    await connectToDB();

    const activePoll = await Poll.findOne({
      status: "active",
      end_date: { $gt: new Date() },
    });

    return new Response(
      JSON.stringify({
        hasActivePoll: !!activePoll,
        poll: activePoll
          ? {
              vote_counts: activePoll.vote_counts,
              total_votes: activePoll.total_votes,
              first_vote_times: activePoll.first_vote_times,
              last_vote_time: activePoll.last_vote_time,
            }
          : null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Anket kontrolü başarısız",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
