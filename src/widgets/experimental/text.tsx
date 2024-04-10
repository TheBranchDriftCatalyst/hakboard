"use client";

interface TextComponentProps {
  text: string;
}

export const TextComponent = ({ text }: TextComponentProps) => {
  return <div>{text}</div>;
};

export default TextComponent;
