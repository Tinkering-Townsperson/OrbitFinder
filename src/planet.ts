type PlanetType = "terrestrial" | "gas" | "ice";

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

const SIZE_WEIGHT: number = 0.35;
const TERRAIN_WEIGHT: number = 0.25;
const AGE_WEIGHT: number = 0.1;
const WATER_WEIGHT: number = 0.1;
const CRATERS_WEIGHT: number = 0.1;
const MOONS_WEIGHT: number = 0.1;

export function compatibility(planet1: Planet, planet2: Planet) {
    const size_compat = similarity(planet1.size, planet2.size) * SIZE_WEIGHT;
    const terrain_compat = adds_to_one(planet1.terrain, planet2.terrain) * TERRAIN_WEIGHT;
    const age_compat = (1 - (Math.max(Math.abs(planet1.age - planet2.age) - 2000, 0) / 10000)) * AGE_WEIGHT;
    const water_compat = opposite(planet1.water, planet2.water) * WATER_WEIGHT;
    const moon_compat = similarity(planet1.moons/10, planet2.moons/10) * MOONS_WEIGHT;
    let overall: number =  age_compat + size_compat + terrain_compat + water_compat + moon_compat;

    if (planet1.type == "terrestrial" && planet2.type == "terrestrial") {
        const crater_compat = similarity(planet1.craters, planet2.craters) * CRATERS_WEIGHT;
        overall += crater_compat;
    } else {
        overall /= (1 - CRATERS_WEIGHT);
    }

    return overall;
}
