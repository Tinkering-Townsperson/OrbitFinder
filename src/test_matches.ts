import { planets } from "./defaultplanets.ts";
import {compatibility, type Planet} from "./planet.ts";

for (let i = 0; i < 20; ++i) {
    const planet1: Planet = planets[Math.floor(Math.random() * planets.length)];
    const planet2: Planet = planets[Math.floor(Math.random() * planets.length)];
    console.log("Compatibility of " + planet1.name + " and " + planet2.name + ": " + Math.round(compatibility(planet1, planet2) * 100) + "%");
}
