"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { disconnectFromDB } from "@/utils/database";
import Image from "next/image";

const Navbar = ({ navbarColor }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async (e) => {
    e.preventDefault();
    console.log("Logout initiated");

    try {
      // Oturumu sonlandır
      await signOut({ redirect: false });
      console.log("User signed out successfully");

      // MongoDB bağlantısını kapat
      await disconnectFromDB();
      console.log("MongoDB disconnected");

      // API'ye logout isteği gönder
      const response = await fetch("/api/logout", { method: "GET" });
      if (!response.ok) {
        throw new Error(`Logout API failed with status: ${response.status}`);
      }
      console.log("Logout API request successful");

      // Kullanıcıyı login sayfasına yönlendir
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav style={{ backgroundColor: navbarColor, borderRadius: "8px" }}>
      <div className="logo">
        <Image
          src="/waiting-sign.png"
          alt="Sand Hourglass Logo"
          width={65} // Orijinal resminizin genişlik/yükseklik oranına göre ayarlayın
          height={30} // "Poll" yazısıyla aynı yükseklikte olacak şekilde ayarlayın
          className="logo-image"
        />
      </div>
      <button type="button" className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  );
};

export default Navbar;
