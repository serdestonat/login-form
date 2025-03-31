import cron from "node-cron";
import { connectToDB } from "@/utils/database";
import Poll from "@/models/poll";

// Yeni anket oluşturma fonksiyonu
const createPoll = async () => {
  try {
    await connectToDB();

    const newPoll = new Poll({
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 hafta sonra
      status: "active",
    });

    await newPoll.save();
    console.log("Yeni anket oluşturuldu:", newPoll);
  } catch (error) {
    console.error("Anket oluşturma hatası:", error);
  }
};

// Eski anketleri yönetme fonksiyonu
const manageOldPolls = async () => {
  try {
    await connectToDB();

    // Tamamlanmış anketleri bul ve en eski olanı sil
    const completedPolls = await Poll.find({ status: "completed" }).sort({
      end_date: 1,
    });
    if (completedPolls.length > 2) {
      await Poll.findByIdAndDelete(completedPolls[0]._id);
      console.log("En eski tamamlanmış anket silindi:", completedPolls[0]._id);
    }

    // Aktif anketi tamamla
    const activePoll = await Poll.findOne({ status: "active" });
    if (activePoll) {
      activePoll.status = "completed";
      await activePoll.save();
      console.log("Aktif anket tamamlandı:", activePoll._id);
    }
  } catch (error) {
    console.error("Eski anketleri yönetme hatası:", error);
  }
};

// Cron job'u başlatma fonksiyonu
export const startCronJob = async () => {
  console.log("Cron job başlatılıyor...");

  // Her çarşamba sabah 08:00'de yeni anket başlat ve eski anketleri yönet
  cron.schedule("0 8 * * 3", async () => {
    console.log(
      "Çarşamba sabah 08:00 yeni anket başlatılıyor ve eski anketler yönetiliyor..."
    );
    await manageOldPolls();
    await createPoll();
  });

  console.log("Cron job başlatıldı.");
};

// Sunucu başlatıldığında cron job'u başlat
startCronJob();
