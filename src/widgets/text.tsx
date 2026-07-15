import { useConfig } from "@/lib/widget-config";
import { useWidgetWidth } from "@/widgets/widget-wrapper";

export const TextWidget = () => {
  const { text } = useConfig({
    text: { type: "string", default: "Hello, World!", label: "Content" },
  } as const);

  const { width } = useWidgetWidth();
  const px = Math.max(14, Math.min(width * 0.06, 44));

  return (
    <div
      className="h-full w-full flex items-center justify-center px-6 text-center"
      data-testid="text-widget"
    >
      <p
        className="text-foreground/90 font-light leading-tight"
        style={{ fontSize: px }}
      >
        {text}
      </p>
    </div>
  );
};

TextWidget.defaultLayout = { w: 10, h: 3 };

export default TextWidget;
