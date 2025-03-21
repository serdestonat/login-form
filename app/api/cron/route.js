import { startCronJob } from "@/scripts/cron";

// Cron job'u başlat
export async function GET() {
  try {
    console.log("Cron job başlatılıyor...");

    // Cron job'u başlat
    startCronJob();

    return new Response(JSON.stringify({ message: "Cron job başlatıldı." }), {
      status: 200,
    });
  } catch (error) {
    console.error("Cron job hatası:", error);
    return new Response(JSON.stringify({ error: "Cron job başlatılamadı." }), {
      status: 500,
    });
  }
}
