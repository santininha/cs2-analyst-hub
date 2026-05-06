import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { glossary as initial, GlossaryTerm } from "@/data/mock";
import { Star, Search, Plus } from "lucide-react";

export const Route = createFileRoute("/glossario")({
  head: () => ({ meta: [{ title: "Glossário — CS2 Analyst Hub" }] }),
  component: GlossaryPage,
});

const categories = [
  { id: "all", label: "Todas" },
  { id: "entrada", label: "Entrada" },
  { id: "clutch", label: "Clutch" },
  { id: "economia", label: "Economia" },
  { id: "mapa", label: "Mapa" },
  { id: "destaque", label: "Destaque" },
  { id: "crise", label: "Crise" },
  { id: "pos-jogo", label: "Pós-jogo" },
] as const;

function GlossaryPage() {
  const [items, setItems] = useState<GlossaryTerm[]>(initial);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>("all");
  const [newTerm, setNewTerm] = useState("");
  const [newPhrase, setNewPhrase] = useState("");

  const filtered = items.filter((g) => {
    const q = query.toLowerCase();
    const inText = !q || g.term.toLowerCase().includes(q) || g.phrase.toLowerCase().includes(q);
    const inCat = tab === "all" || g.category === tab;
    return inText && inCat;
  });

  const toggleFav = (id: string) =>
    setItems(items.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)));

  const add = () => {
    if (!newTerm || !newPhrase) return;
    setItems([{ id: crypto.randomUUID(), term: newTerm, phrase: newPhrase, category: (tab === "all" ? "entrada" : tab) as any, favorite: false }, ...items]);
    setNewTerm(""); setNewPhrase("");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Glossário da Caster" subtitle="Frases prontas, expressões e palavras-chave para a transmissão." />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar termo ou frase..." className="pl-10" />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="flex-wrap h-auto">
          {categories.map((c) => <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <Card className="mb-4 border-dashed">
        <CardContent className="p-4 grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
          <Input value={newTerm} onChange={(e) => setNewTerm(e.target.value)} placeholder="Termo (ex: Clutch)" />
          <Input value={newPhrase} onChange={(e) => setNewPhrase(e.target.value)} placeholder="Frase para usar ao vivo..." />
          <Button onClick={add}><Plus className="h-4 w-4 mr-1" />Adicionar</Button>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        {filtered.map((g) => (
          <Card key={g.id} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-3.5 flex items-start gap-3">
              <button onClick={() => toggleFav(g.id)} className="mt-0.5 shrink-0">
                <Star className={`h-4 w-4 ${g.favorite ? "fill-primary text-primary" : "text-muted-foreground/50"}`} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">{g.term}</span>
                  <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4">{g.category}</Badge>
                </div>
                <p className="text-[15px] font-medium leading-[1.55] text-foreground">
                  "{g.phrase}"
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-10 text-[13px]">Nenhuma frase encontrada.</p>}
      </div>
    </div>
  );
}
