import { compatibility, type Planet } from '../src/planet';
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
    craters: 0.1
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

    const buckets = {
        '90-100% (Soulmates)': 0,
        '80-89% (Great)': 0,
        '70-79% (Good)': 0,
        '60-69% (Okay)': 0,
        '50-59% (Neutral)': 0,
        '40-49% (Poor)': 0,
        '0-39% (Terrible)': 0
    };

    let totalScore = 0;
    let minScore = 1;
    let maxScore = 0;
    let bestPlanet: Planet | null = null;

    targetPlanets.forEach(p => {
        const score = compatibility(basePlanet, p);
        totalScore += score;
        if (score < minScore) minScore = score;
        if (score > maxScore) {
            maxScore = score;
            bestPlanet = p;
        }
        
        if (score >= 0.9) buckets['90-100% (Soulmates)']++;
        else if (score >= 0.8) buckets['80-89% (Great)']++;
        else if (score >= 0.7) buckets['70-79% (Good)']++;
        else if (score >= 0.6) buckets['60-69% (Okay)']++;
        else if (score >= 0.5) buckets['50-59% (Neutral)']++;
        else if (score >= 0.4) buckets['40-49% (Poor)']++;
        else buckets['0-39% (Terrible)']++;
    });

    Object.entries(buckets).forEach(([label, count]) => {
        const bar = '█'.repeat(Math.ceil((count / targetPlanets.length) * 50));
        console.log(`${label.padEnd(20)} | ${count.toString().padStart(4)} | ${bar}`);
    });

    console.log(`Avg: ${(totalScore / targetPlanets.length * 100).toFixed(1)}% | Min: ${(minScore * 100).toFixed(1)}% | Max: ${(maxScore * 100).toFixed(1)}%`);
    
    if (bestPlanet) {
        console.log(`\n🏆 BEST MATCH: ${bestPlanet.name}`);
        console.log(`Score: ${(maxScore * 100).toFixed(2)}%`);
        console.log(`Traits: Type=${bestPlanet.type}, Size=${bestPlanet.size}, Water=${bestPlanet.water}, Terrain=${bestPlanet.terrain}, Moons=${bestPlanet.moons}, Craters=${bestPlanet.craters}, Color=${bestPlanet.colour}, Age=${bestPlanet.age}`);
    }
}

runDistribution(earth, realPlanets, "Baseline: Earth against ALL Planets (for comparison)");

