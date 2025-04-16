"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndTodos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const { data: todosData, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Todos 데이터 가져오기 실패", error);
      } else {
        setTodos(todosData || []);
      }
    };
    fetchUserAndTodos();
  }, [router]);

  // 로그아웃
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패", error);
    } else {
      router.push("/auth/login");
    }
  };

  // Todo 목록 추가
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase.from("todos").insert([
      {
        title: newTodo,
        user_id: user.id,
        is_complete: false,
      },
    ]);

    if (error) {
      console.error("Todo 추가 실패", error);
    } else {
      setNewTodo("");
      // 추가된 후 새로고침
      const { data: updatedTodos } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);
      setTodos(updatedTodos || []);
    }
  };

  // Todo 수정
  const toggleTodo = async (id: string, isComplete: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({
        is_complete: !isComplete,
      })
      .eq("id", id);

    if (error) {
      console.error("Todo 수정 실패", error);
    } else {
      // 수정된 후 새로고침
      const { data: updatedTodos } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);
      setTodos(updatedTodos || []);
    }
  };

  // Todo 삭제
  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Todo 삭제 실패", error);
    } else {
      // 삭제된 후 새로고침
      const { data: updatedTodos } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);
      setTodos(updatedTodos || []);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* 로그아웃 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          로그아웃
        </button>
      </div>

      <h1>나의 To-do 리스트</h1>

      {/* Todo 추가 폼 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="새 할 일 입력"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          추가
        </button>
      </div>

      {/* Todo 리스트 */}
      {todos.length === 0 ? (
        <p>할 일이 없습니다!</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ marginBottom: "1rem" }}>
              <span
                onClick={() => toggleTodo(todo.id, todo.is_complete)}
                style={{
                  textDecoration: todo.is_complete ? "line-through" : "none",
                  cursor: "pointer",
                  marginRight: "0.5rem",
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
