import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { dataSources } from "@/data/mock";
import { useTeams } from "@/contexts/TeamsContext";
import { Database, FileSpreadsheet, FileJson, Link as LinkIcon, Construction, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/fontes")({
  head: () => ({ meta: [{ title: "Fontes de Dados — CS2 Analyst Hub" }] }),
  component: DataSources,
});

const icons: Record<string, any> = { API: Database, CSV: FileSpreadsheet, JSON: FileJson, URL: LinkIcon };

function DataSources() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Fontes de Dados" subtitle="Em breve: importe dados reais via API, CSV, JSON ou link de partida." />

      <Card className="mb-6 bg-accent border-primary/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Construction className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <strong>Funcionalidade em desenvolvimento.</strong> A arquitetura do app já está pronta para receber dados externos. As integrações serão liberadas progressivamente.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {dataSources.map((d) => {
          const Icon = icons[d.type] ?? Database;
          return (
            <Card key={d.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline">{d.status}</Badge>
                </div>
                <h3 className="font-bold mb-1">{d.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{d.description}</p>
                <Button disabled className="w-full">Conectar (em breve)</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
