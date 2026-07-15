import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfigInstances, usePatchConfig, type ControlDef } from "@/lib/widget-config";

const Control = ({
  instanceKey,
  propKey,
  def,
  value,
  onChange,
}: {
  instanceKey: string;
  propKey: string;
  def: ControlDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) => {
  const id = `${instanceKey}-${propKey}`;
  const label = def.label ?? propKey;

  switch (def.type) {
    case "number":
      return (
        <div className="space-y-1.5">
          <Label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            {label}
          </Label>
          <Input
            id={id}
            type="number"
            min={def.min}
            max={def.max}
            step={def.step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            className="font-mono tabular-nums bg-surface-2 border-border text-sm"
          />
        </div>
      );
    case "boolean":
      return (
        <label className="flex items-center gap-2.5 cursor-pointer group py-1" htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-3.5 w-3.5 rounded-none border-border bg-surface-2 accent-primary"
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground">
            {label}
          </span>
        </label>
      );
    case "enum":
      return (
        <div className="space-y-1.5">
          <Label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            {label}
          </Label>
          <select
            id={id}
            className="w-full rounded-sm border border-border bg-surface-2 px-2 py-1.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary/40"
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          >
            {def.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    case "string":
    default:
      return (
        <div className="space-y-1.5">
          <Label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            {label}
          </Label>
          <Input
            id={id}
            type="text"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="bg-surface-2 border-border text-sm"
          />
        </div>
      );
  }
};

export const WidgetControls = () => {
  const instances = useConfigInstances();
  const patch = usePatchConfig();
  const entries = Object.entries(instances);

  return (
    <div className="h-full flex flex-col">
      <header className="px-2 pb-4 border-b border-border">
        <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-muted-foreground">
          Controls
        </div>
        <div className="mt-1 text-sm text-foreground">Widget Controls</div>
      </header>
      <ScrollArea className="flex-1 pt-2">
        {entries.length === 0 && (
          <div className="text-xs text-muted-foreground py-4 px-2">
            No widgets rendered.
          </div>
        )}
        <Accordion type="single" collapsible>
          {entries.map(([instanceKey, reg]) => (
            <AccordionItem key={instanceKey} value={instanceKey} className="border-border">
              <AccordionTrigger className="text-sm hover:no-underline px-2 hover:text-primary">
                <span className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono tabular-nums text-[10px] text-muted-foreground/60"
                  >
                    {instanceKey}
                  </span>
                  <span>{reg.displayName}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4 px-2">
                {Object.entries(reg.schema).map(([propKey, def]) => (
                  <Control
                    key={propKey}
                    instanceKey={instanceKey}
                    propKey={propKey}
                    def={def}
                    value={reg.values[propKey]}
                    onChange={(v) => patch(instanceKey, propKey, v)}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default WidgetControls;
