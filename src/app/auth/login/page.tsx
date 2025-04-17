"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <Wrapper>
      <h1>로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          marginBottom: "1rem",
          padding: "0.5rem",
          width: "100%",
        }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          marginBottom: "1rem",
          padding: "0.5rem",
          width: "100%",
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        로그인
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <button
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginLeft: "1rem",
        }}
        onClick={() => router.push("/auth/signup")}
      >
        회원가입 하러가기
      </button>
    </Wrapper>
  );
}
