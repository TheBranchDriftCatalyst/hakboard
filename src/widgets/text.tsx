import { useConfig } from "@/lib/widget-config";

export const TextWidget = () => {
  const { text } = useConfig({
    text: { type: "string", default: "Hello, World!", label: "Text" },
  } as const);
  return <div>{text}</div>;
};

TextWidget.defaultLayout = { w: 10, h: 3 };

export default TextWidget;
