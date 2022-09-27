const fs = require('fs');
const config = require('./raptiye.config');
const { getPath, getImportPath } = require('./scripts/helpers');
const Code = require('./scripts/Code');
const fetch = require('node-fetch-commonjs');

function getCollection() {
  const collection = fetch(config.collectionLink)
    .then((res) => res.json())
    .then((r) => r)
    .catch((e) => {
      throw Error('Postman collection not found!');
    });
  return collection;
}

function useFolder(_path) {
  const fullPath = getPath(__dirname, _path);
  return fs.existsSync(fullPath) || fs.mkdirSync(fullPath, { recursive: true });
}

async function writeControllers(collection) {
  const controllerRoot = getPath(
    config.folders.base,
    config.folders.controller
  );
  useFolder(controllerRoot);
  const items = collection.item;

  items.forEach(({ name, item }) => {
    const controllerPath = getPath(
      __dirname,
      controllerRoot,
      `${name}Controller.js`
    );
    const methodNames = item.map((i) => i.name);

    const methods = item.reduce(
      (prev, current) =>
        prev + `\nconst ${current.name}=async(req,res,next)=>{}\n`,
      ''
    );
    Code.setMethods(methods)
      .setExports(...methodNames)
      .writeFile(controllerPath);
  });
}
async function writeRoutes(collection) {
  const routesRoot = getPath(config.folders.base, config.folders.routes);
  useFolder(routesRoot);
  const items = collection.item;

  items.forEach(({ name, item }) => {
    const routePath = getPath(__dirname, routesRoot, name + 'Route.js');
    const basePath = getPath(__dirname, config.folders.base);
    const controllersPath = getPath(basePath, config.folders.controller);
    const routersPath = getPath(basePath, config.folders.routes);
    let controllerImportPath = getImportPath(routersPath, controllersPath);
    controllerImportPath += name + 'Controller.js';

    const imports = [
      {
        from: 'express',
        as: 'express',
        isDefault: true,
      },
      {
        from: controllerImportPath,
        as: 'controller',
        isDefault: true,
      },
    ];
    const routes = item.reduce((prev, current) => {
      return (
        prev +
        `\nrouter.${current.request.method.toLowerCase()}('/${
          current.name
        }',controller.${current.name})\n`
      );
    }, '');

    const routerDeclaration = `const router=express.Router()\n`;
    Code.setImports(...imports)
      .setDeclarations(routerDeclaration)
      .setMethods(routes)
      .setExports('router')
      .writeFile(routePath);
  });
}
async function writeRoutesIndex(collection) {
  const routesRoot = getPath(config.folders.base, config.folders.routes);
  const indexPath = getPath(__dirname, routesRoot, 'index.js');

  const items = collection.item;
  const app = `const app=express.Router()\n`;

  const express = {
    from: 'express',
    as: 'express',
    isDefault: true,
  };
  const imports = [];
  imports.push(express);
  const importRoutes = items.map((i) => ({
    from: `./${i.name}Route.js`,
    as: `${i.name}Route`,
    isDefault: true,
  }));
  imports.push(...importRoutes);

  const routes = items.reduce(
    (prev, current) =>
      prev + `\napp.use('/${current.name}',${current.name}Route)\n`,
    ''
  );

  Code.setImports(...imports)
    .setDeclarations(app)
    .setMethods(routes)
    .setExports('app')
    .writeFile(indexPath);
}

async function writeAll() {
  useFolder(`${config.folders.base}`);
  const collection = await getCollection();
  writeControllers(collection);
  writeRoutes(collection);
  writeRoutesIndex(collection);
}
writeAll();
