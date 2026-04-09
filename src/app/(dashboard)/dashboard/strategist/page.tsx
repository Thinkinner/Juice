import { StrategistChat } from "@/components/dashboard/strategist-chat";

export default function StrategistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI content strategist</h1>
        <p className="text-sm text-muted-foreground">
          Question-answering over your database — optional LLM layer can be added with strict grounding.
        </p>
      </div>
      <StrategistChat />
    </div>
  );
}
