/**
 * Camada central de partidas reais.
 *
 * MatchEnriched é o objeto padronizado consumido pela Mesa de Análise,
 * Sala da Partida e listagem de Partidas. Combina dados da GRID (quando
 * disponíveis) com fallback no mock atual, sem quebrar nenhuma tela.
 */

import { CURRENT_ACTIVE_DUTY_MAP_POOL } from "@/lib/mapPool";
import type { Team } from "@/data/mock";

export type MatchStatus = "upcoming" | "live" | "completed";

export type MatchSource = "grid" | "mock" | "mock+grid";

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
  lastSyncAt: string;
};

export function activeDutyMapPool() {
  return CURRENT_ACTIVE_DUTY_MAP_POOL.activeMaps.map((m) => ({
    id: m.id,
    name: m.name,
  }));
}
