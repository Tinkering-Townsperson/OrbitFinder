interface Planet {
    name: string;
    age: number;
    size: number;
    terrain: number;
    type: string;  // terrestrial/gas
    colour: string;
    water: number;
    moons: number;
    atmosphere: number;
    distance_to_star: number;
}

const mercury: Planet = {
    name: "Mercury",
    age: 25,
    size: 0.3,
    terrain: 0.3,
    type: "terrestrial",
    colour: "",
    water: 0,
    moons: 0,
    atmosphere: 0.2,
    distance_to_star: 2
}

const venus: Planet = {
    name: "Venus",
    age: 25,
    size: 0.7,
    terrain: 0.3,
    type: "terrestrial",
    colour: "",
    water: 0.1,
    moons: 0,
    atmosphere: 0.3,
    distance_to_star: 4
}

const earth: Planet = {
    name: "Earth",
    age: 25,
    size: 0.7,
    terrain: 0.2,
    type: "terrestrial",
    colour: "",
    water: 0.7,
    moons: 1,
    atmosphere: 0.5,
    distance_to_star: 7
}

const mars: Planet = {
    name: "Mars",
    age: 25,
    size: 0.5,
    terrain: 0.4,
    type: "terrestrial",
    colour: "",
    water: 0.5,
    moons: 1,
    atmosphere: 0.3,
    distance_to_star: 11
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
    return trait_a + trait_b;
}

const SIZE_WEIGHT: number = 0.45;
const TERRAIN_WEIGHT: number = 0.4;
const WATER_WEIGHT: number = 0.15;

function compatibility(planet1: Planet, planet2: Planet) {
    const size_compatibility = similarity(planet1.size, planet2.size) * SIZE_WEIGHT;
    const terrain_compatibility = adds_to_one(planet1.terrain, planet2.terrain) * TERRAIN_WEIGHT;
    const water_compatibility = opposite(planet1.water, planet2.water) * WATER_WEIGHT;

    return size_compatibility + terrain_compatibility + water_compatibility;
}

console.log("Earth/Mercury score " + (compatibility(mercury, earth) * 100).toString() + "%")
console.log()
console.log("Earth/Venus score " + (compatibility(venus, earth) * 100).toString() + "%");
console.log()
console.log("Earth/Mars score " + (compatibility(mars, earth) * 100).toString() + "%");

// TODO: Remove console.logs because clutter
