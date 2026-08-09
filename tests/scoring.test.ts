import { getPerspectives, type Planet } from '../src/planet';
import { realPlanets } from '../src/data/planets-real';

const earth: Planet = {
    name: 'Earth (Terrestrial)',
    age: 4500,
    size: 0.25,
    terrain: 0.3,
    type: 'terrestrial',
    colour: '#3f6b46',
    water: 0.7,
    moons: 1,
    craters: 0.1,
    favoured: ["water"]
};

const jupiter: Planet = {
    name: 'Jupiter (Gas Giant)',
    age: 4600,
    size: 1.0,
    terrain: 0.8,
    type: 'gas',
    colour: '#d9b98a',
    water: 0,
    moons: 10,
    craters: 0
};

const neptune: Planet = {
    name: 'Neptune (Ice Giant)',
    age: 4500,
    size: 0.4,
    terrain: 0.3,
    type: 'ice',
    colour: '#5d8fa3',
    water: 0,
    moons: 4,
    craters: 0
};

const maxWaterWorld: Planet = {
    name: 'Max Water World',
    age: 5000,
    size: 0.5,
    terrain: 0.0,
    type: 'terrestrial',
    colour: '#0000ff', // Pure blue
    water: 1.0,
    moons: 0,
    craters: 0.0
};

const chaosRock: Planet = {
    name: 'Tiny Chaos Rock',
    age: 1000, // Very young
    size: 0.0, // Minimum size
    terrain: 1.0, // Max rugged
    type: 'terrestrial',
    colour: '#ff0000', // Pure red
    water: 0.0, // Bone dry
    moons: 10, // Max moons on minimum size
    craters: 1.0 // Max craters
};

const ancientGas: Planet = {
    name: 'Ancient Gas Giant',
    age: 13000, // Very old
    size: 1.0, // Max size
    terrain: 0.0, // Smooth
    type: 'gas',
    colour: '#000000', // Pitch black
    water: 0.0,
    moons: 0, // No moons
    craters: 0.0
};

function runDistribution(basePlanet: Planet, targetPlanets: Planet[], description: string) {
    console.log(`\n--- ${description} (${targetPlanets.length} planets) ---`);

    const diffBuckets = {
        '0-5% (Mutual Agreement)': 0,
        '5-10% (Slight Difference)': 0,
        '10-15% (Noticeable Gap)': 0,
        '15-20% (One-Sided)': 0,
        '20%+ (Extremely One-Sided)': 0
    };

    let totalDiff = 0;
    let maxDiff = 0;
    let maxDiffPlanet: Planet | null = null;

    targetPlanets.forEach(p => {
        const { userPerspective, matchPerspective } = getPerspectives(basePlanet, p);
        const diff = Math.abs(userPerspective - matchPerspective);
        
        totalDiff += diff;
        if (diff > maxDiff) {
            maxDiff = diff;
            maxDiffPlanet = p;
        }
        
        if (diff < 0.05) diffBuckets['0-5% (Mutual Agreement)']++;
        else if (diff < 0.10) diffBuckets['5-10% (Slight Difference)']++;
        else if (diff < 0.15) diffBuckets['10-15% (Noticeable Gap)']++;
        else if (diff < 0.20) diffBuckets['15-20% (One-Sided)']++;
        else diffBuckets['20%+ (Extremely One-Sided)']++;
    });

    Object.entries(diffBuckets).forEach(([label, count]) => {
        const bar = '█'.repeat(Math.ceil((count / targetPlanets.length) * 50));
        console.log(`${label.padEnd(28)} | ${count.toString().padStart(4)} | ${bar}`);
    });

    console.log(`\nAverage Difference: ${(totalDiff / targetPlanets.length * 100).toFixed(1)}%`);
    
    if (maxDiffPlanet) {
        const p = getPerspectives(basePlanet, maxDiffPlanet);
        console.log(`\n💔 MOST ONE-SIDED MATCH: ${maxDiffPlanet.name}`);
        console.log(`Difference: ${(maxDiff * 100).toFixed(2)}%`);
        console.log(`How much Earth likes it: ${(p.userPerspective * 100).toFixed(1)}%`);
        console.log(`How much it likes Earth: ${(p.matchPerspective * 100).toFixed(1)}%`);
        console.log(`Traits: Type=${maxDiffPlanet.type}, Water=${maxDiffPlanet.water}, Favors=[${maxDiffPlanet.favoured.join(', ')}]`);
    }
}

runDistribution(earth, realPlanets, "Baseline: Earth against ALL Planets (for comparison)");

