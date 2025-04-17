import styled from "@emotion/styled";

const Button = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

export default function EmotionTest() {
  return <Button>Styled 버튼</Button>;
}
