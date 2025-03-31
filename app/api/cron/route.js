import { startCronJob } from "@/scripts/cron";

let cronJobStarted = false; // Cron job'un başlatılıp başlatılmadığını takip et

// Cron job'u başlat
export async function GET() {
  try {
    if (!cronJobStarted) {
      console.log("Cron job başlatılıyor...");
      await startCronJob();
      cronJobStarted = true;
      return new Response(JSON.stringify({ message: "Cron job başlatıldı." }), {
        status: 200,
      });
    } else {
      return new Response(
        JSON.stringify({ message: "Cron job zaten başlatıldı." }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Cron job hatası:", error);
    return new Response(JSON.stringify({ error: "Cron job başlatılamadı." }), {
      status: 500,
    });
  }
}
