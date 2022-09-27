const { getImportPath, getPath } = require('../helpers');
test('getImportPath should return correct path', function () {
  const cases = [
    {
      from: '/routes/bla/bla',
      to: '/controllers/blabla',
      result: './../../../controllers/blabla/',
    },
    {
      from: '/controllers/blabla',
      to: '/routes/bla/bla',
      result: './../../routes/bla/bla/',
    },
  ];
  cases.forEach(({ from, to, result }) => {
    const _result = getImportPath(from, to);
    expect(_result).toBe(result);
  });
});

test('getPath function should  combine paths and return full path', () => {
  const _path = getPath('a', 'b', 'c.js');
  expect(_path).toBe('a/b/c.js');
});
