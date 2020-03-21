const Fs = require('fs');

let pluginCount = 0;
let indexFileContent = "import PluginBase from '../pluginBase';\n\n" +
  'const plugins: PluginBase[] = [];\n\n';

Fs.readdirSync('src/plugins').forEach((entryName) => {
  if (entryName === 'index.ts') {
    return;
  }

  console.log(`installing ${entryName}`);

  indexFileContent += `import ${entryName} from "./${entryName}";\n` +
    `plugins.push(new ${entryName}());\n\n`;

  pluginCount += 1;
});

indexFileContent += 'export default plugins;';

Fs.writeFileSync('src/plugins/index.ts', indexFileContent);

console.log(`installed ${pluginCount} plugin sucessfully`);
