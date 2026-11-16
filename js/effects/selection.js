import { byId } from "./catalog.js";
export function compatible(a, b) {
  return (
    a.slot !== b.slot &&
    !(
      ["frame", "cinema"].includes(a.slot) &&
      ["frame", "cinema"].includes(b.slot)
    )
  );
}
export function compositions(
  ids,
  { tracking = true, previous = [], random = Math.random } = {},
) {
  const pool = [...new Set(ids)]
    .map((id) => byId.get(id))
    .filter((e) => e && (!e.requiresTracking || tracking));
  if (!pool.length)
    throw new Error(
      "Activa al menos un efecto disponible para este dispositivo.",
    );
  const shuffle = (a) =>
    a
      .map((v) => ({ v, r: random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.v);
  const candidates = new Map();
  for (const e of pool) candidates.set(e.id, [e]);
  for (const e of shuffle(pool))
    for (const b of shuffle(pool)) {
      if (!compatible(e, b)) continue;
      const pair = [e, b].sort((a, b) => a.id.localeCompare(b.id));
      candidates.set(pair.map((v) => v.id).join("|"), pair);
      const third = shuffle(pool).find(
        (c) => pair.every((p) => compatible(c, p)) && c.slot === "ambient",
      );
      if (third) {
        const trio = [...pair, third].sort((a, b) => a.id.localeCompare(b.id));
        candidates.set(trio.map((v) => v.id).join("|"), trio);
      }
    }
  const all = shuffle([...candidates.entries()]).sort(
    (a, b) => Number(previous.includes(a[0])) - Number(previous.includes(b[0])),
  );
  return Array.from({ length: 4 }, (_, i) =>
    all[i % all.length][1].map((e) => e.id),
  );
}
