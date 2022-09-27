const { importValues, exportValues } = require('../scripts/module');
const fs = require('fs');
const prettier = require('prettier');

class Code {
  #imports = '';
  #declarations = '';
  #methods = '';
  #exports = '';
  setImports(...files) {
    const imports = importValues(...files);
    this.#imports = imports;
    return this;
  }

  setExports(...files) {
    const exports = exportValues(...files);
    this.#exports = exports;
    return this;
  }
  setDeclarations(declarations) {
    this.#declarations = declarations;
    return this;
  }
  setMethods(methods) {
    //methods
    this.#methods = methods;
    return this;
  }

  writeFile(path) {
    let file = ''.concat(
      this.#imports,
      this.#declarations,
      this.#methods,
      this.#exports
    );
    file = prettier.format(file, { parser: 'babel', semi: true });

    fs.open(path, 'a', function (err, fd) {
      if (err) {
        console.log(err);
      }
      fs.writeFileSync(fd, file);
    });
  }
}

module.exports = new Code();
