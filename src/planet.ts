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

console.log("Mercury/Earth size score " + (similarity(mercury.size, earth.size) * 100).toString() + "%")
console.log("Mercury/Earth terrain score" + (adds_to_one(mercury.terrain, earth.terrain) * 100).toString() + "%")
console.log("Mercury/Earth water score " + (opposite(mercury.water, earth.water) * 100).toString() + "%")
console.log()
console.log("Venus/Earth size score " + (similarity(venus.size, earth.size) * 100).toString() + "%");
console.log("Venus/Earth terrain score " + (adds_to_one(venus.terrain, earth.terrain) * 100).toString() + "%");
console.log("Venus/Earth water score " + (opposite(venus.water, earth.water) * 100).toString() + "%")
console.log()
console.log("Earth/Mars size score " + (similarity(mars.size, earth.size) * 100).toString() + "%");
console.log("Earth/Mars terrain score " + (adds_to_one(mars.terrain, earth.terrain) * 100).toString() + "%");
console.log("Earth/Mars water score " + (opposite(mars.water, earth.water) * 100).toString() + "%")

// TODO: Remove console.logs because clutter
