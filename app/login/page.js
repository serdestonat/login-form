"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
      router.push("/homePage?fromLogin=true");
    }
  };

  useEffect(() => {
    if (session === "authenticated") {
      router.push("/homePage");
    }
  }, [session, router]);

  if (session === "loading") {
    return <div>Loading...</div>; // Show loading state if session is loading
  }

  return (
    <div className="not-found-container">
      <div className="meinen">
        <form onSubmit={handleSubmit} className="formen">
          <h1>Login</h1>
          <div className="area">
            <label className="labelmail">E-Mail</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="inputbox"
            ></input>
          </div>
          <div className="area">
            <label className="labelpass">Password</label>
            <input
              type="password"
              placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="inputbox"
            ></input>
          </div>
          <div className="loginbutton">
            <button type="submit" className="button">
              Login
            </button>
          </div>
        </form>

        <p>Do not have an account ?</p>
        <button className="registerbutton">
          <Link href="/register">Sign Up</Link>
        </button>

        <h4>Login With Google</h4>

        <button
          className="button"
          data-provider="google"
          onClick={() => {
            signIn("google", { callbackUrl: "/homePage" });
          }}
        >
          <FcGoogle size={20} /> Sign In With Google
        </button>
      </div>
    </div>
  );
}
