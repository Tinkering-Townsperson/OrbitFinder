import { solarSystemPlanets } from "./planets-solarsystem.ts";
import { realPlanets } from "./planets-real.ts";
import { curatedKnownPlanets } from "./planets-wellknown.ts";
import type {Planet} from "../planet.ts";
import {fetchAllPlanets} from "../download.ts";

export const planets: Planet[] = [
    ...solarSystemPlanets,
    ...realPlanets,
    ...curatedKnownPlanets,
    ...(await fetchAllPlanets()),
]
