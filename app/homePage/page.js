"use client";

import styles from "@/app/homePage/page.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  const [lastVoteTime, setLastVoteTime] = useState(null); // Son oy zamanı
  const [remainingTime, setRemainingTime] = useState(0); // Kalan süre (saniye cinsinden)

  // Kalan süreyi hesapla ve güncelle
  useEffect(() => {
    if (lastVoteTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = Math.floor((now - lastVoteTime) / 1000); // Geçen süre (saniye)
        const timeLeft = 300 - timeDiff; // 5 dakika = 300 saniye

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
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, button }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Oy kullanma işlemi başarısız.");
      }

      const data = await response.json();
      console.log(data.message);
      // Oy sayısını güncelle
      setVotes((prevVotes) => ({
        ...prevVotes,
        [button]: prevVotes[button] + 1,
      }));

      // Toplam oy sayısını güncelle
      setTotalVotes((prevTotal) => prevTotal + 1);

      // İlk oy zamanını kaydet
      if (!firstVoteTime[button]) {
        setFirstVoteTime((prevTimes) => ({
          ...prevTimes,
          [button]: new Date(),
        }));
      }

      // Son oy zamanını kaydet
      setLastVoteTime(new Date());
      setRemainingTime(300); // 5 dakika = 300 saniye
    } catch (error) {
      console.log(error);
    }
  };

  // En çok oy alan butonu belirle ve Navbar rengini güncelle
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
        // Eşitlik durumunda ilk oy alan butonu seç
        winningButton = winningButtons.reduce((a, b) =>
          firstVoteTime[a] < firstVoteTime[b] ? a : b
        );
      }

      // Navbar rengini güncelle
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
      <Footer remainingTime={remainingTime} />
    </>
  );
};

export default Page;
