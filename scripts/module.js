const config = require('./config');

function exportValues(...values) {
  if (values.length === 1) {
    return config.module !== 'commonjs'
      ? `\nexport default ${values[0]}`
      : `\nmodule.exports=${values[0]}`;
  }
  if (config.module === 'commonjs') {
    return `\nmodule.exports={
          ${values.map((v) => v)}  
    }`;
  }
  return `\nexport {  ${values.map((v) => v)}  }`;
}

function importValues(...values) {
  const imports = values.reduce((prev, { from, isDefault = false, as }) => {
    let statement = '';
    if (config.module === 'commonjs') {
      statement = `const ${as} =require('${from}')\n`;
    } else {
      statement = `import ${isDefault ? as : `* as ${as}`} from '${from}'\n`;
    }
    return prev + statement;
  }, '');
  return imports;
}

module.exports = {
  exportValues,
  importValues,
};
