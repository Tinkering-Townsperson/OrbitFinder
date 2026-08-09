export type PlanetType = "terrestrial" | "gas" | "ice";
export type FavouredTrait = "age" | "size" | "terrain" | "colour" | "water" | "moon"

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
    favoured: FavouredTrait[];
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

const BASE_WEIGHTS = {
    size: 0.20,
    terrain: 0.15,
    age: 0.15,
    water: 0.15,
    colour: 0.15,
    moon: 0.10,
    craters: 0.10
};

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

export function getPerspectives(planet1: Planet, planet2: Planet) {
    const isTerrestrial = planet1.type === "terrestrial" && planet2.type === "terrestrial";
    const scores = {
        size: similarity(planet1.size, planet2.size),
        terrain: adds_to_one(planet1.terrain, planet2.terrain),
        age: Math.max(0, 1 - (Math.max(Math.abs(planet1.age - planet2.age) - 500, 0) / 4000)),
        water: opposite(planet1.water, planet2.water),
        moon: similarity(planet1.moons/10, planet2.moons/10),
        colour: color_compatibility(planet1.colour, planet2.colour),
        craters: isTerrestrial ? similarity(planet1.craters, planet2.craters) : 0
    };

    const calcFor = (favouredTraits: FavouredTrait[]) => {
        const weights = { ...BASE_WEIGHTS };
        for (const t of favouredTraits) {
            if (weights[t as keyof typeof weights] !== undefined) {
                weights[t as keyof typeof weights] += 0.40;
            }
        }
        let totalW = 0;
        let score = 0;
        for (const [trait, w] of Object.entries(weights)) {
            if (!isTerrestrial && trait === "craters") continue;
            totalW += w;
        }
        for (const [trait, rawScore] of Object.entries(scores)) {
            if (!isTerrestrial && trait === "craters") continue;
            score += rawScore * (weights[trait as keyof typeof weights] / totalW);
        }
        return score;
    };

    return {
        userPerspective: calcFor(planet1.favoured || []),
        matchPerspective: calcFor(planet2.favoured || [])
    };
}


