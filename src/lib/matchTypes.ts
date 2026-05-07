/**
 * Camada central de partidas reais.
 *
 * MatchEnriched é o objeto padronizado consumido pela Mesa de Análise,
 * Sala da Partida e listagem de Partidas.
 *
 * Regras importantes:
 * - `source` nunca mistura: ou veio da GRID ("grid") ou é mock interno ("mock").
 * - `quality` indica a confiabilidade do dado para o caster.
 */

import { CURRENT_ACTIVE_DUTY_MAP_POOL } from "@/lib/mapPool";
import type { Team } from "@/data/mock";

export type MatchStatus = "upcoming" | "live" | "completed";

export type MatchSource = "grid" | "mock";

/**
 * Classificação de qualidade do dado, exibida ao caster.
 * - grid-real: partida confirmada via GRID API.
 * - manual: prévia manual marcada (mock interno selecionado).
 * - mock-fallback: mock genérico exibido quando não há GRID.
 * - ignored-low-relevance: filtrada e não deve aparecer.
 */
export type MatchQuality = "grid-real" | "manual" | "mock-fallback" | "ignored-low-relevance";

export type MatchEnriched = {
  id: string;
  /** Slug interno (ex: m1), quando vier do mock; pode ser igual a id. */
  slug: string;
  tournament: string;
  boType: string;
  /** ISO datetime. */
  startTime: string;
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  result?: { scoreA: number; scoreB: number };
  /** Map pool oficial (Active Duty) — referência única. */
  mapPool: { id: string; name: string }[];
  /** Mapas previstos/jogados na série. */
  maps: { name: string; scoreA?: number; scoreB?: number }[];
  source: MatchSource;
  quality: MatchQuality;
  /** Pontuação de relevância (maior = mais útil para análise). */
  relevance: number;
  lastSyncAt: string;
};

export function activeDutyMapPool() {
  return CURRENT_ACTIVE_DUTY_MAP_POOL.activeMaps.map((m) => ({
    id: m.id,
    name: m.name,
  }));
}

/**
 * Detecta torneios e times claramente sem relevância competitiva.
 * Usado para descartar GRID-TEST, partidas internas/sandbox e times genéricos.
 */
export function isLowRelevance(args: {
  tournament: string;
  teamAName: string;
  teamBName: string;
}): boolean {
  const t = args.tournament.toLowerCase();
  if (
    t.includes("test") ||
    t.includes("sandbox") ||
    t.includes("grid-test") ||
    t.includes("scrim") ||
    t.includes("showmatch") ||
    t.includes("demo")
  ) {
    return true;
  }
  const generic = (n: string) => {
    const x = n.trim().toLowerCase();
    if (!x) return true;
    if (/^cs2[-_ ]?\d+$/.test(x)) return true;
    if (/^team[-_ ]?[a-z]$/.test(x)) return true;
    if (/^test/.test(x)) return true;
    if (/^anonym/.test(x)) return true;
    if (/^tbd$/.test(x) || /^placeholder/.test(x)) return true;
    return false;
  };
  return generic(args.teamAName) || generic(args.teamBName);
}

/**
 * Limite inferior de janela: começo do dia atual (local). Tudo anterior é
 * considerado "histórico" e fica fora da exibição padrão.
 */
export function startOfTodayMs(now: Date = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
