/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary";
  fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;

  background-color: ${({ color }) =>
    color === "secondary" ? "#3b82f6" : "#10b981"};

  &:hover {
    background-color: ${({ color }) =>
      color === "secondary" ? "#2563eb" : "#059669"};
  }

  ${({ fullWidth }) => fullWidth && `width: 100%;`}
`;

export default function Button({
  children,
  color = "primary",
  ...props
}: ButtonProps) {
  return (
    <StyledButton color={color} {...props}>
      {children}
    </StyledButton>
  );
}
