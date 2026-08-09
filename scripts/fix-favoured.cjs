const fs = require('fs');

const files = [
  'src/data/planets-real.ts',
  'src/data/planets-solarsystem.ts',
  'src/data/planets-wellknown.ts',
  'tests/scoring.test.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Replaces favoured: "trait" or favoured: 'trait' with favoured: ["trait"]
  content = content.replace(/favoured:\s*(["'])([a-z]+)\1/g, 'favoured: ["$2"]');
  fs.writeFileSync(file, content, 'utf8');
}
