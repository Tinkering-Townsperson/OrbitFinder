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
    favoured: FavouredTrait;
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

export function compatibility(planet1: Planet, planet2: Planet) {
    const weights = { ...BASE_WEIGHTS };
    
    // The "Important Factor" logic: Increase the weight of the traits each planet favors
    // This makes their favored trait significantly impact the final score.
    if (planet1.favoured && weights[planet1.favoured] !== undefined) {
        weights[planet1.favoured] += 0.20; // Massive boost to importance
    }
    if (planet2.favoured && weights[planet2.favoured] !== undefined) {
        weights[planet2.favoured] += 0.20;
    }

    // Normalize weights so the maximum possible score is always exactly 100%
    let totalWeight = 0;
    const isTerrestrial = planet1.type === "terrestrial" && planet2.type === "terrestrial";
    
    for (const [trait, w] of Object.entries(weights)) {
        // Ignore craters if they aren't both terrestrial planets (fixes Gas Giant penalty)
        if (!isTerrestrial && trait === "craters") continue;
        totalWeight += w;
    }

    // Calculate raw scores (0 to 1 scale) for each trait
    const scores = {
        size: similarity(planet1.size, planet2.size),
        terrain: adds_to_one(planet1.terrain, planet2.terrain),
        age: Math.max(0, 1 - (Math.max(Math.abs(planet1.age - planet2.age) - 500, 0) / 4000)),
        water: opposite(planet1.water, planet2.water), // Fixed broken Math.max logic
        moon: similarity(planet1.moons/10, planet2.moons/10),
        colour: color_compatibility(planet1.colour, planet2.colour),
        craters: isTerrestrial ? similarity(planet1.craters, planet2.craters) : 0
    };

    // Apply normalized weights to get the final compatibility score
    let finalScore = 0;
    for (const [trait, rawScore] of Object.entries(scores)) {
        if (!isTerrestrial && trait === "craters") continue;
        const normalizedWeight = weights[trait as keyof typeof weights] / totalWeight;
        finalScore += rawScore * normalizedWeight;
    }

    return finalScore;
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

    const calcFor = (weightsObj: Record<string, number>) => {
        let totalW = 0;
        let score = 0;
        for (const [trait, w] of Object.entries(weightsObj)) {
            if (!isTerrestrial && trait === "craters") continue;
            totalW += w;
        }
        for (const [trait, rawScore] of Object.entries(scores)) {
            if (!isTerrestrial && trait === "craters") continue;
            score += rawScore * (weightsObj[trait] / totalW);
        }
        return score;
    };

    const userW = { ...BASE_WEIGHTS };
    if (planet1.favoured && userW[planet1.favoured] !== undefined) userW[planet1.favoured] += 0.20;
    
    const matchW = { ...BASE_WEIGHTS };
    if (planet2.favoured && matchW[planet2.favoured] !== undefined) matchW[planet2.favoured] += 0.20;

    return {
        userPerspective: calcFor(userW as Record<string, number>),
        matchPerspective: calcFor(matchW as Record<string, number>)
    };
}
