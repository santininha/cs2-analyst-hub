/**
 * Central source of truth for the CS2 competitive map pool (Active Duty).
 *
 * Any UI that talks about "current rotation", "matchup picks", "team strengths
 * by map" or "caster prep" must read from here — never hardcode map lists in
 * components. If Valve rotates a map in/out, change it here and the whole app
 * follows.
 */

export type MapPoolEntry = {
  id: string;
  name: string;
  /** True if currently part of the Active Duty pool. */
  active: boolean;
  /** When this map last entered the pool, for "recently added" UX. */
  addedAt?: string;
  /** When this map last left the pool, for historical rendering. */
  removedAt?: string;
};

/** Active Duty map pool — competitive rotation as of 2026-05. */
export const ACTIVE_DUTY: MapPoolEntry[] = [
  { id: "dust2", name: "Dust2", active: true },
  { id: "mirage", name: "Mirage", active: true },
  { id: "inferno", name: "Inferno", active: true },
  { id: "nuke", name: "Nuke", active: true },
  { id: "ancient", name: "Ancient", active: true },
  { id: "overpass", name: "Overpass", active: true },
  { id: "anubis", name: "Anubis", active: true },
];

/** Maps that have been in past rotations but are NOT current Active Duty. */
export const HISTORICAL_MAPS: MapPoolEntry[] = [
  { id: "vertigo", name: "Vertigo", active: false, removedAt: "2025-10-01" },
  { id: "train", name: "Train", active: false, removedAt: "2024-09-01" },
  { id: "cache", name: "Cache", active: false, removedAt: "2020-04-01" },
indented_placeholder // sentinel removed
];
