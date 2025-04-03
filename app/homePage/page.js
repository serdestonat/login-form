"use client";

import styles from "@/app/homePage/page.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarningModal from "@/components/WarningModal";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const [votes, setVotes] = useState({
    button1: 0,
    button2: 0,
    button3: 0,
    button4: 0,
    button5: 0,
  });

  const { data: session } = useSession();
  const [totalVotes, setTotalVotes] = useState(0);
  const [navbarColor, setNavbarColor] = useState("");
  const [firstVoteTime, setFirstVoteTime] = useState({});
  const [lastVoteTime, setLastVoteTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");

  const timeNow = new Date().toLocaleString();

  // Anket oluşturma fonksiyonu
  const createPoll = async () => {
    try {
      const response = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("Anket oluşturma başarısız:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Anket oluşturuldu:", data.message);
    } catch (error) {
      console.error("Anket oluşturma hatası:", error);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan son oy zamanını yükle
    const savedLastVoteTime = localStorage.getItem("lastVoteTime");
    if (savedLastVoteTime) {
      setLastVoteTime(new Date(savedLastVoteTime));

      // Kalan süreyi hesapla
      const now = new Date();
      const lastVote = new Date(savedLastVoteTime);
      const timeDiff = Math.floor((now - lastVote) / 1000);
      const timeLeft = 300 - timeDiff;

      if (timeLeft > 0) {
        setRemainingTime(timeLeft);
      }
    }

    const initializeApp = async () => {
      try {
        // Aktif anket kontrolü
        const pollCheck = await fetch("/api/poll", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!pollCheck.ok) {
          throw new Error("Anket kontrolü başarısız");
        }

        const pollData = await pollCheck.json();

        if (!pollData.exists) {
          await createPoll();
        }

        // Oyları yükle
        const votesResponse = await fetch("/api/votes");
        if (votesResponse.ok) {
          const voteData = await votesResponse.json();
          setVotes({
            button1: voteData.button1 || 0,
            button2: voteData.button2 || 0,
            button3: voteData.button3 || 0,
            button4: voteData.button4 || 0,
            button5: voteData.button5 || 0,
          });
          setTotalVotes(Object.values(voteData).reduce((a, b) => a + b, 0));
        }
      } catch (error) {
        console.error("Başlatma hatası:", error);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Kalan süreyi hesapla ve güncelle
    if (lastVoteTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = Math.floor((now - lastVoteTime) / 1000);
        const timeLeft = 300 - timeDiff;

        if (timeLeft > 0) {
          setRemainingTime(timeLeft);
        } else {
          setRemainingTime(0);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastVoteTime]);

  const handleVote = async (button) => {
    const now = new Date();
    const lastVote = lastVoteTime ? new Date(lastVoteTime) : null;
    const diffMinutes = lastVote ? (now - lastVote) / (1000 * 60) : 0;

    if (lastVote && diffMinutes < 5) {
      setWarningMessage("Süreniz dolmadan tekrar oy kullanamazsınız.");
      return; // Oy kullanma işlemini durdur
    }

    try {
      console.log(session);
      const response = await fetch("/api/vote", {
        method: "POST", // GET yerine POST kullanın
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.email, button }), // body ekleyin
      });

      if (!response.ok) {
        console.log("API yanıt durumu:", response.status);
        console.log("API URL:", response.url);
        const errorData = await response.json();
        throw new Error(errorData.error || "Oy kullanma işlemi başarısız.");
      }

      const data = await response.json();
      console.log(data.message);
      setVotes((prevVotes) => ({
        ...prevVotes,
        [button]: prevVotes[button] + 1,
      }));
      setTotalVotes((prevTotal) => prevTotal + 1);

      if (!firstVoteTime[button]) {
        setFirstVoteTime((prevTimes) => ({
          ...prevTimes,
          [button]: new Date(),
        }));
      }

      setLastVoteTime(now);
      localStorage.setItem("lastVoteTime", now.toString());
      setRemainingTime(300);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (totalVotes > 0) {
      const maxVotes = Math.max(...Object.values(votes));
      const winningButtons = Object.keys(votes).filter(
        (key) => votes[key] === maxVotes
      );

      let winningButton;
      if (winningButtons.length === 1) {
        winningButton = winningButtons[0];
      } else {
        winningButton = winningButtons.reduce((a, b) =>
          firstVoteTime[a] < firstVoteTime[b] ? a : b
        );
      }

      switch (winningButton) {
        case "button1":
          setNavbarColor("brown");
          break;
        case "button2":
          setNavbarColor("green");
          break;
        case "button3":
          setNavbarColor("cadetblue");
          break;
        case "button4":
          setNavbarColor("blueviolet");
          break;
        case "button5":
          setNavbarColor("darkorange");
          break;
        default:
          setNavbarColor("");
      }
    }
  }, [votes, totalVotes, firstVoteTime]);

  return (
    <>
      <Navbar navbarColor={navbarColor} />
      <div className={styles.header}>Home Page</div>
      <div className={styles.container}>
        <button
          className={styles.button1}
          onClick={() => handleVote("button1")}
        >
          Option 1
        </button>
        <button
          className={styles.button2}
          onClick={() => handleVote("button2")}
        >
          Option 2
        </button>
        <button
          className={styles.button3}
          onClick={() => handleVote("button3")}
        >
          Option 3
        </button>
        <button
          className={styles.button4}
          onClick={() => handleVote("button4")}
        >
          Option 4
        </button>
        <button
          className={styles.button5}
          onClick={() => handleVote("button5")}
        >
          Option 5
        </button>
      </div>
      <WarningModal
        isOpen={!!warningMessage}
        message={warningMessage}
        onClose={() => setWarningMessage("")}
      />
      <Footer remainingTime={remainingTime} />
    </>
  );
};

export default Page;
