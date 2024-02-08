"use client";

import WidgetWrapper from "@/widgets/widget-wrapper";

interface TextComponentProps {
  text: string;
}

export const TextComponent = ({ text }: TextComponentProps) => {
  return <div>{text}</div>;
};

export default WidgetWrapper(TextComponent, { text: "Hello, World!" });
