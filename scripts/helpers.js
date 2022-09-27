function getImportPath(source, destination) {
  const sourceFolders = source.split('/');
  const destinationFolders = destination.split('/');

  let directory = './';

  const isInside = sourceFolders.every(
    (folder, index) => folder === destinationFolders[index]
  );

  let index = sourceFolders.length - 1;
  if (!isInside) {
    while (index >= 0) {
      if (sourceFolders[index] === destinationFolders[index]) break;
      directory += '../';
      index--;
    }
    index = 0;
    while (index < destinationFolders.length) {
      if (destinationFolders[index] !== sourceFolders[index]) {
        directory += destinationFolders[index] + '/';
      }
      index++;
    }
    return directory;
  }
  index = 0;
  while (index < destinationFolders.length) {
    if (destinationFolders[index] !== sourceFolders[index]) {
      destination += destinationFolders[index] + '/';
    }
  }
  return directory;
}

function getPath(...paths) {
  return paths.reduce((prev, current, index) => {
    if (index !== paths.length - 1) {
      current += '/';
    }
    return prev + current;
  }, '');
}

module.exports = {
  getImportPath,
  getPath,
};
