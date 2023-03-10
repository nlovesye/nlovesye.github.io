const fs = require('fs');
const path = require('path');

const source = resolveDir('build', 'index.html');
const dest = resolveDir('index.html');

fs.rename(source, dest, function (error) {
  if (error) {
    console.log(error);
  }
  fs.stat(dest, function (err) {
    if (err) {
      console.log(err);
    }
  });
});

function resolveDir(...paths) {
  return path.resolve(__dirname, '..', ...paths);
}
