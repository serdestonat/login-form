"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/register", {
      name,
      email,
      password,
    });
    router.push("/app/page.js");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Register</h2>
          <label>Name</label>
          <input
            type="text"
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label>E-Mail</label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="*******"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
