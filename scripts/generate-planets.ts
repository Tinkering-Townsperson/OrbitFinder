// scripts/generate-planets.ts
//
// Fetches real confirmed exoplanets from NASA's Exoplanet Archive (TAP API),
// picks a diverse subset, and derives our Planet shape from the physical data.
//
// age / size / type are real measurements (star age, radius).
// terrain / craters / water / moons / colour have NO real observational data
// for exoplanets (we don't have surface imagery of planets light-years away),
// so they're procedurally derived from a seeded hash of the planet's name.
// Re-running this script always produces the same output for the same planet.
//
// Requires Node 18+ (uses global fetch). Run with e.g.:
//   npx tsx scripts/generate-planets.ts > src/data/planets-real.ts
//
// API docs: https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html

import type { Planet, PlanetType } from "../src/planet.ts"; // adjust path to your project

const TAP_BASE = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

const ADQL = `
  select pl_name, hostname, pl_rade, pl_masse, pl_eqt, st_age
  from ps
  where default_flag = 1
    and pl_rade is not null
    and pl_masse is not null
    and pl_eqt is not null
    and st_age is not null
  order by pl_name asc
`
    .replace(/\s+/g, " ")
    .trim();

const TARGET_COUNT = 1000;

interface RawRow {
    pl_name: string;
    hostname: string;
    pl_rade: number; // planet radius, Earth radii
    pl_masse: number; // planet mass, Earth masses
    pl_eqt: number; // equilibrium temperature, Kelvin
    st_age: number; // host star age, Gyr
}

// ---------- fetch + parse ----------

async function fetchRows(): Promise<RawRow[]> {
    const url = `${TAP_BASE}?query=${encodeURIComponent(ADQL)}&format=csv`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(
            `NASA Exoplanet Archive request failed: ${res.status} ${res.statusText}`
        );
    }
    const csv = await res.text();
    return parseCsv(csv);
}

// Simple comma-split parser. None of the columns we're pulling (pl_name,
// hostname, and four numeric fields) contain embedded commas in this
// dataset, so this is safe here. If you add columns that might (e.g. a
// free-text discovery description), swap this for a real CSV parser
// like papaparse instead.
function parseCsv(csv: string): RawRow[] {
    const lines = csv.trim().split("\n");
    const header = lines[0].split(",").map((h) => h.trim());

    return lines
        .slice(1)
        .map((line) => {
            const cells = line.split(",");
            const row: Record<string, string> = {};
            header.forEach((key, i) => {
                row[key] = cells[i];
            });
            return {
                pl_name: row.pl_name,
                hostname: row.hostname,
                pl_rade: parseFloat(row.pl_rade),
                pl_masse: parseFloat(row.pl_masse),
                pl_eqt: parseFloat(row.pl_eqt),
                st_age: parseFloat(row.st_age),
            };
        })
        .filter(
            (r) =>
                !!r.pl_name &&
                Number.isFinite(r.pl_rade) &&
                Number.isFinite(r.pl_masse) &&
                Number.isFinite(r.pl_eqt) &&
                Number.isFinite(r.st_age)
        );
}

// ---------- selection ----------

function pickDiverseSample(rows: RawRow[], count: number): RawRow[] {
    // Keep only one planet per host star, so the list isn't dominated by
    // e.g. all 7 TRAPPIST-1 planets or all 8 Kepler-90 planets.
    const byHost = new Map<string, RawRow>();
    for (const row of rows) {
        if (!byHost.has(row.hostname)) byHost.set(row.hostname, row);
    }
    const unique = [...byHost.values()];

    // Stratify by size class so the sample has a real mix of terrestrial /
    // sub-Neptune / giant planets, rather than whatever NASA's detection
    // methods happen to find the most of (mostly sub-Neptunes, in reality).
    const bins: Record<"small" | "medium" | "large", RawRow[]> = {
        small: [],
        medium: [],
        large: [],
    };
    for (const row of unique) {
        if (row.pl_rade < 1.75) bins.small.push(row);
        else if (row.pl_rade < 6) bins.medium.push(row);
        else bins.large.push(row);
    }

    const perBin = Math.floor(count / 3);
    const sample = [
        ...bins.small.slice(0, perBin),
        ...bins.medium.slice(0, perBin),
        ...bins.large.slice(0, count - perBin * 2),
    ];

    return sample.slice(0, count);
}

// ---------- deterministic "vibes" generator ----------
// Seeded PRNG so re-running the script on the same NASA data always
// produces the same derived traits for a given planet name.

function seedFromName(name: string): number {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
        h = (h << 5) - h + name.charCodeAt(i);
        h |= 0;
    }
    return h >>> 0;
}

function mulberry32(seed: number) {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ---------- field derivation ----------

function classifyType(radiusEarth: number): PlanetType {
    if (radiusEarth < 1.75) return "terrestrial";
    if (radiusEarth < 6) return "ice"; // sub-Neptune / ice-giant range
    return "gas";
}

function deriveSize(radiusEarth: number): number {
    const JUPITER_RADII = 11.2;
    return round2(clamp(radiusEarth / JUPITER_RADII, 0.05, 1));
}

function deriveTerrain(type: PlanetType, rand: () => number): number {
    return round2(rand());
}

function deriveCraters(type: PlanetType, rand: () => number): number {
    if (type !== "terrestrial") return 0; // no solid surface to crater
    return round2(rand());
}

function deriveWater(eqt: number, type: PlanetType, rand: () => number): number {
    if (type !== "terrestrial") return 0;
    // Chaotic fun: Any planet can be a water world!
    return round2(rand());
}

function deriveMoons(type: PlanetType, rand: () => number): number {
    return Math.floor(rand() * 11);
}

function deriveAge(stAgeGyr: number): number {
    return Math.round(stAgeGyr * 1000); // Gyr -> Myr, matching your `age` convention
}

function deriveColour(eqt: number, type: PlanetType, rand: () => number): string {
    // Pure vibrant chaos!
    const h = rand() * 360;
    const s = 40 + rand() * 60; // 40-100% saturation
    const l = 20 + rand() * 60; // 20-80% lightness
    return hslToHex(h, s, l);
}

function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l * 100];

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h: number;
    switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        default:
            h = (r - g) / d + 4;
    }
    return [h * 60, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) =>
        Math.round(x * 255)
            .toString(16)
            .padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

// ---------- assembly ----------

function toPlanet(row: RawRow): Planet {
    const rand = mulberry32(seedFromName(row.pl_name));
    const type = classifyType(row.pl_rade);
    return {
        name: row.pl_name,
        age: deriveAge(row.st_age),
        size: deriveSize(row.pl_rade),
        terrain: deriveTerrain(type, rand),
        type,
        colour: deriveColour(row.pl_eqt, type, rand),
        water: deriveWater(row.pl_eqt, type, rand),
        moons: deriveMoons(type, rand),
        craters: deriveCraters(type, rand),
    };
}

async function main() {
    const rows = await fetchRows();
    const sample = pickDiverseSample(rows, TARGET_COUNT);
    const planets = sample.map(toPlanet);

    const output = `// AUTO-GENERATED by scripts/generate-planets.ts — do not edit by hand.
// Source: NASA Exoplanet Archive (Planetary Systems table, TAP API).
// age / size / type are real measurements. terrain, craters, water, moons,
// and colour are procedurally derived (see script) — no real observational
// data exists for those traits on exoplanets.
import type { Planet } from "../planet";

export const realPlanets: Planet[] = ${JSON.stringify(planets, null, 2)};
`;

    process.stdout.write(output);
    console.error(`Generated ${planets.length} planets.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});