import { ReactNode } from "react";
import styled from "@emotion/styled";

interface TodoItemProps {
  children: ReactNode;
}

interface TodoTextProps {
  children: ReactNode;
  onClick?: () => void;
  completed?: boolean;
}

const StyledTodoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const StyledTodoText = styled.span<{ completed: boolean }>`
  cursor: pointer;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  color: ${(props) => (props.completed ? "#9ca3af" : "#111827")};
`;

export const TodoItem = ({ children }: TodoItemProps) => {
  return <StyledTodoItem>{children}</StyledTodoItem>;
};

export const TodoText = ({
  children,
  onClick,
  completed = false,
}: TodoTextProps) => {
  return (
    <StyledTodoText completed={completed} onClick={onClick}>
      {children}
    </StyledTodoText>
  );
};
