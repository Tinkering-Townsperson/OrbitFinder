const fs = require('fs');

let content = fs.readFileSync('src/data/planets-real.ts', 'utf8');

// The names look like `"name": "\"EPIC 201595106 b\""`
// So we want to replace `"\"` with `"` at the start, and `\""` with `"` at the end.
// Regex: "name": "\"([^\"]+)\"" -> "name": "$1"
content = content.replace(/"name":\s*"\\?"([^"\\]+)\\?""/g, '"name": "$1"');

fs.writeFileSync('src/data/planets-real.ts', content, 'utf8');
