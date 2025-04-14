"use client";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  async function testSupabase() {
    const { data, error } = await supabase.from("todos").select("*");
    console.log(data, error);
  }

  return (
    <div>
      <h1>Hello Supabase</h1>
      <button
        onClick={testSupabase}
        style={{
          padding: "8px 16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Fetch Todos
      </button>
    </div>
  );
}
