export type PlanetType = "terrestrial" | "gas" | "ice";

export interface Planet {
    name: string;
    age: number;
    size: number;
    terrain: number;
    type: PlanetType;
    colour: string;
    water: number;
    moons: number;
    craters: number;
    favoured: string;
}

/* RULE TYPES:
- Similarity (difference as close to zero as possible)
- Opposite (difference as large as possible)
- Adds-to-one (sum as close to one as possible)
*/

function similarity(trait_a: number, trait_b: number) {
    return 1 - Math.abs(trait_a - trait_b);
}

function opposite(trait_a: number, trait_b: number) {
    return Math.abs(trait_a - trait_b);
}

function adds_to_one(trait_a: number, trait_b: number) {
    return 1 - Math.abs((trait_a + trait_b) - 1);
}

const SIZE_WEIGHT: number = 0.20;
const TERRAIN_WEIGHT: number = 0.15;
const AGE_WEIGHT: number = 0.15;
const WATER_WEIGHT: number = 0.15;
const COLOUR_WEIGHT: number = 0.15;
const MOONS_WEIGHT: number = 0.10;

function hexToHue(hex: string): number {
    const r = parseInt(hex.substring(1,3), 16) / 255;
    const g = parseInt(hex.substring(3,5), 16) / 255;
    const b = parseInt(hex.substring(5,7), 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
        const d = max - min;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return h * 360;
}

function color_compatibility(hex1: string, hex2: string): number {
    const h1 = hexToHue(hex1);
    const h2 = hexToHue(hex2);
    // Rewards 0 degrees (Analogous) and 180 degrees (Complementary)
    // Penalizes 90 degrees (Clashing)
    return Math.abs(Math.cos((h1 - h2) * Math.PI / 180));
}

function conditional_weight(weight: number, trait: string, favoured: string) {
    return weight + (trait == favoured ? 0.1 : 0);
}

export function compatibility(planet1: Planet, planet2: Planet) {
    const size_compat = similarity(planet1.size, planet2.size) * conditional_weight(SIZE_WEIGHT, "size", planet2.favoured);
    const terrain_compat = adds_to_one(planet1.terrain, planet2.terrain) * conditional_weight(TERRAIN_WEIGHT, "terrain", planet2.favoured);
    const age_compat = Math.max(0, 1 - (Math.max(Math.abs(planet1.age - planet2.age) - 500, 0) / 4000)) * conditional_weight(AGE_WEIGHT, "age", planet2.favoured);
    const water_compat = Math.max(opposite(planet1.water, planet2.water) * 2, 1) * conditional_weight(WATER_WEIGHT, "water", planet2.favoured);
    const moon_compat = similarity(planet1.moons/10, planet2.moons/10) * conditional_weight(MOONS_WEIGHT, "moons", planet2.favoured);
    const color_compat = color_compatibility(planet1.colour, planet2.colour) * conditional_weight(COLOUR_WEIGHT, "colour", planet2.favoured);

    return age_compat + size_compat + terrain_compat + water_compat + moon_compat + color_compat;
}
