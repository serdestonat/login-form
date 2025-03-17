"use client";

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { session } from "next-auth";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/login", {
      email,
      password,
    });
    if (response.data.message === "success") {
      router.push("/homePage");
    }
  };

  if (session) {
    router.push("/homePage");
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div>
          <label>E-Mail</label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="*******"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
          <button type="submit">Login</button>
        </div>
      </form>

      <p>Do not have an account ? Sign up here.</p>
      <button>
        <Link href="/register">Sign Up</Link>
      </button>

      <h2>Login With Google</h2>

      <button
        onClick={() => {
          signIn("google");
        }}
      >
        <FcGoogle /> Sign In With Google
      </button>
    </div>
  );
}
