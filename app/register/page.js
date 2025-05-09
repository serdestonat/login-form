"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

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
    router.push("/");
  };

  return (
    <div className="not-found-container">
      <div className="meinen">
        <form onSubmit={handleSubmit}>
          <div className="area">
            <h1>Register</h1>
            <label>Name</label>
            <input
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              className="inputbox"
            ></input>
          </div>
          <div className="area">
            <label>E-Mail</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="inputbox"
            ></input>
          </div>
          <div className="area">
            <label>Password</label>
            <input
              type="password"
              placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
              className="inputbox"
            ></input>
          </div>
          <div className="loginbutton">
            <button type="submit" className="button">
              Register
            </button>
            <Link href="/" className="button">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
