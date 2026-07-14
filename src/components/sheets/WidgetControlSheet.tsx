import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
        <div>
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            type="number"
            min={def.min}
            max={def.max}
            step={def.step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          />
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <Label htmlFor={id}>{label}</Label>
        </div>
      );
    case "enum":
      return (
        <div>
          <Label htmlFor={id}>{label}</Label>
          <select
            id={id}
            className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
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
        <div>
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            type="text"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
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
    <div className="p-4 h-full">
      <SheetHeader>
        <SheetTitle>Widget Controls</SheetTitle>
      </SheetHeader>
      <ScrollArea className="h-full pt-4">
        {entries.length === 0 && (
          <div className="text-sm text-muted-foreground py-4">
            No widgets registered yet — render something to see its controls.
          </div>
        )}
        <Accordion type="single" collapsible>
          {entries.map(([instanceKey, reg]) => (
            <AccordionItem key={instanceKey} value={instanceKey}>
              <AccordionTrigger>{reg.displayName}</AccordionTrigger>
              <AccordionContent className="space-y-3">
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
