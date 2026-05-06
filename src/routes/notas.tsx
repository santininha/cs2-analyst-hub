import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { notes as initial, Note, teams, players, maps as csmaps, matches } from "@/data/mock";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/notas")({
  head: () => ({ meta: [{ title: "Notas e Análises — CS2 Analyst Hub" }] }),
  component: NotesPage,
});

const NONE = "__none__";

function NotesPage() {
  const [items, setItems] = useState<Note[]>(initial);
  const [draft, setDraft] = useState<Partial<Note>>({ priority: "media", date: new Date().toISOString().slice(0, 10) });
  const [tagInput, setTagInput] = useState("");

  const add = () => {
    if (!draft.title || !draft.content) return;
    setItems([{
      id: crypto.randomUUID(),
      title: draft.title, content: draft.content,
      tags: tagInput.split(",").map(t=>t.trim()).filter(Boolean),
      priority: draft.priority as any || "media",
      date: draft.date || new Date().toISOString().slice(0,10),
      linkedTeamId: draft.linkedTeamId, linkedPlayerId: draft.linkedPlayerId,
      linkedMapId: draft.linkedMapId, linkedMatchId: draft.linkedMatchId,
    }, ...items]);
    setDraft({ priority: "media", date: new Date().toISOString().slice(0, 10) });
    setTagInput("");
  };

  const remove = (id: string) => setItems(items.filter((n) => n.id !== id));

  const priorityColor = (p: string) =>
    p === "alta" ? "bg-primary text-primary-foreground" : p === "media" ? "bg-warning/20 text-foreground" : "bg-muted";

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Notas e análises" subtitle="Suas anotações livres com tags, prioridade e vínculos." />

      <Card className="mb-6 border-dashed">
        <CardContent className="p-4 space-y-3">
          <Input placeholder="Título" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Textarea placeholder="Conteúdo da nota..." rows={3} value={draft.content ?? ""} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Input placeholder="Tags (vírgula)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
            <Select value={draft.priority} onValueChange={(v: any) => setDraft({ ...draft, priority: v })}>
              <SelectTrigger><SelectValue placeholder="Prioridade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={draft.date ?? ""} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            <Select value={draft.linkedTeamId ?? NONE} onValueChange={(v) => setDraft({ ...draft, linkedTeamId: v === NONE ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Vincular time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— nenhum —</SelectItem>
                {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={draft.linkedPlayerId ?? NONE} onValueChange={(v) => setDraft({ ...draft, linkedPlayerId: v === NONE ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Vincular jogador" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— nenhum —</SelectItem>
                {players.map((p) => <SelectItem key={p.id} value={p.id}>{p.nick}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={draft.linkedMapId ?? NONE} onValueChange={(v) => setDraft({ ...draft, linkedMapId: v === NONE ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Vincular mapa" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— nenhum —</SelectItem>
                {csmaps.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={draft.linkedMatchId ?? NONE} onValueChange={(v) => setDraft({ ...draft, linkedMatchId: v === NONE ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Vincular partida" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— nenhuma —</SelectItem>
                {matches.map((m) => <SelectItem key={m.id} value={m.id}>{m.event}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end"><Button onClick={add}><Plus className="h-4 w-4 mr-1" />Adicionar nota</Button></div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {items.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <div className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString("pt-BR")}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge className={priorityColor(n.priority)}>{n.priority}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="text-sm">{n.content}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {n.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
