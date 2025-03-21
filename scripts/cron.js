import cron from "node-cron";
import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";

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
const startCronJob = () => {
  console.log("Cron job başlatılıyor...");

  // Her çarşamba gece yarısı yeni anket başlat
  cron.schedule("0 0 * * 3", async () => {
    console.log("Çarşamba gece yarısı yeni anket başlatılıyor...");
    await createPoll();
  });

  console.log("Cron job başlatıldı.");
};

// Sunucu başlatıldığında cron job'u başlat
startCronJob();

export default startCronJob;
