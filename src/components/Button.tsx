import styled, { css } from "styled-components";

export const Button = styled.button<ButtonProps>`
  cursor: pointer;
  background: cornflowerblue;
  color: white;

  margin: 4px;
  padding: 12px 24px;
  border-radius: 3px;
  border: none;

  ${(props) =>
    props.secondary &&
    css`
      background: transparent;
      border: 2px solid cornflowerblue;
      color: cornflowerblue;
    `}
`;

type ButtonProps = {
  primary?: boolean;
  secondary?: boolean;
};
