import styles from "@/app/homePage/page.module.css";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <div className={styles.header}>Home Page</div>
      <div className={styles.container}>
        <button className={styles.button1}>Option 1</button>
        <button className={styles.button2}>Option 2</button>
        <button className={styles.button3}>Option 3</button>
        <button className={styles.button4}>Option 4</button>
        <button className={styles.button5}>Option 5</button>
      </div>
    </>
  );
};

export default page;
