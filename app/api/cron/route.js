import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";
import cron from "node-cron";

// Yeni anket oluşturma fonksiyonu
const createPoll = async () => {
  await connectToDB();

  const newPoll = new Poll({
    start_date: new Date(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 hafta sonra
    status: "active",
  });

  await newPoll.save();
  console.log("Yeni anket oluşturuldu:", newPoll);
};

// Cron job'u başlat
export async function GET() {
  try {
    console.log("Cron job başlatılıyor...");

    // Her çarşamba gece yarısı yeni anket başlat
    cron.schedule("0 0 * * 3", async () => {
      console.log("Çarşamba gece yarısı yeni anket başlatılıyor...");
      await createPoll();
    });

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
