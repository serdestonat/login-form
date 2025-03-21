"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { disconnectFromDB } from "@/utils/database";

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
    <nav style={{ backgroundColor: navbarColor }}>
      <div className="logo">
        <h1>Poll</h1>
      </div>
      <button type="button" className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  );
};

export default Navbar;
