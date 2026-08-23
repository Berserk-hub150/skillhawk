const fs = require('fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function buildTasks() {
  const legacy = readJson('community/backlog/tasks.json');
  const catalog = readJson('community/backlog/catalog.json');
  const generated = [];
  let number = 100;

  for (const category of catalog.categories) {
    for (const angle of catalog.angles) {
      const id = `MC-${String(number).padStart(3, '0')}`;
      generated.push({
        id,
        category: category.slug,
        title: `Add ${angle.name.toLowerCase()} guidance for ${category.name}`,
        file: `community/micro-contributions/${category.slug}/${angle.slug}.json`,
        topic: `${category.name} — ${angle.name}`,
        tip: 'REPLACE_ME',
        prompt: `Write one concise original tip about ${category.focus}; specifically, ${angle.prompt}.`,
        generated: true
      });
      number += 1;
    }
  }

  return [...legacy, ...generated];
}

module.exports = { buildTasks };
