"use client";

import { useMediaQuery } from "react-responsive";
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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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

  // Kullanıcı değiştiğinde veya sayfa yüklendiğinde geri sayımı ayarla
  useEffect(() => {
    if (!session?.user?.email) return;

    const userLastVotes = JSON.parse(
      localStorage.getItem("userLastVotes") || "{}"
    );
    const lastVoteTime = userLastVotes[session.user.email]
      ? new Date(userLastVotes[session.user.email])
      : null;

    if (lastVoteTime) {
      const now = new Date();
      const timeDiff = Math.floor((now - lastVoteTime) / 1000);
      const timeLeft = 300 - timeDiff;

      if (timeLeft > 0) {
        setRemainingTime(timeLeft);
      } else {
        setRemainingTime(0);
      }
    }
  }, [session]);

  // Geri sayımı güncelle
  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  const handleVote = async (button) => {
    if (!session?.user?.email) return;

    const now = new Date();
    const userEmail = session.user.email;

    // Kullanıcının son oy zamanını al
    const userLastVotes = JSON.parse(
      localStorage.getItem("userLastVotes") || "{}"
    );
    const lastVoteTime = userLastVotes[userEmail]
      ? new Date(userLastVotes[userEmail])
      : null;
    const diffSeconds = lastVoteTime ? (now - lastVoteTime) / 1000 : 0;

    if (lastVoteTime && diffSeconds < 300) {
      setWarningMessage("Süreniz dolmadan tekrar oy kullanamazsınız.");
      return;
    }

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userEmail, button }),
      });

      if (!response.ok) {
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

      // Kullanıcının oy zamanını güncelle
      const updatedLastVotes = {
        ...userLastVotes,
        [userEmail]: now.toString(),
      };
      localStorage.setItem("userLastVotes", JSON.stringify(updatedLastVotes));
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
      <div className={styles.header}>Poll Page</div>
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
