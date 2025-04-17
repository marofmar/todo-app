"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { TodoItem, TodoText } from "@/components/TodoList";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 50%;
  position: relative;
  transform: rotate(15deg);
  transition: background-color 0.2s;
  margin-right: 1.5rem;

  &:hover {
    background-color: #059669;
    &:before,
    &:after {
      background-color: #059669;
    }
  }
`;

const TodoForm = styled.div`
  background-color: pink;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  &:focus {
    outline: none;
    border-color: pink;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

const TodoListContainer = styled.div`
  background-color: ;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  & > ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

const EmptyMessage = styled.p`
  color: #6b7280;
  text-align: center;
  padding: 1rem;
`;

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
    <Container>
      <Content>
        <Header>
          <Title>나의 To-do 리스트</Title>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </Header>

        <TodoForm>
          <InputGroup>
            <Input
              type="text"
              placeholder="새 할 일 입력"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <AddButton onClick={addTodo}>추가</AddButton>
          </InputGroup>
        </TodoForm>

        <TodoListContainer>
          {todos.length === 0 ? (
            <EmptyMessage>할 일이 없습니다!</EmptyMessage>
          ) : (
            <ul>
              {todos.map((todo) => (
                <TodoItem key={todo.id}>
                  <TodoText
                    onClick={() => toggleTodo(todo.id, todo.is_complete)}
                    completed={todo.is_complete}
                  >
                    {todo.title}
                  </TodoText>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    삭제
                  </button>
                </TodoItem>
              ))}
            </ul>
          )}
        </TodoListContainer>
      </Content>
    </Container>
  );
}
