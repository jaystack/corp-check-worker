import fs = require('fs');
import path = require('path');

import parallel = require('async/parallel');
import hostedGitInfo = require('hosted-git-info');

const LICENSES = [
  'LICENSE',
  'LICENSE.txt',
  'LICENSE.md',
  'LICENCE',
  'LICENCE.txt',
  'LICENCE.md',

  'license',
  'license.txt',
  'license.md',
  'licence',
  'licence.txt',
  'licence.md'
];

const noop = () => {};

export default function getLicense(modulePath, optionalCallback?): any {
  return new Promise((resolve, reject) => {
    const done = finalize(resolve, reject, optionalCallback || noop);

    readPackage(modulePath, (err, pkg) => {
      if (err) return done(err);

      getLicensePath(modulePath, (err, licensePath) => {
        if (err) return done(err);
        try {
          const res = {
            license: pkg.license,
            licenseFile: licensePath,
            repo: getRepo(pkg),
            private: !!pkg.private
          };
          done(null, res);
        } catch (err) {
          done(err);
        }
      });
    });
  });
}

// return data for both callback && promise interface
function finalize(resolve, reject, cb) {
  return (err, res?) => {
    if (err) {
      cb(err);
      return reject(err);
    }

    cb(null, res);
    resolve(res);
  };
}

function readPackage(modulePath, cb) {
  fs.readFile(path.join(modulePath, 'package.json'), 'utf8', (err, content) => {
    let pkg = {};

    if (!err) {
      try {
        pkg = JSON.parse(content);
      } catch (e) {
        // ignored
      }
    }

    // keeping the error first convention even if we never return an error here
    cb(null, pkg);
  });
}

function getLicensePath(modulePath, cb) {
  fs.readdir(modulePath, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') {
        err.message = 'Module not found: ' + err.message;
      }

      return cb(err);
    }

    const tasks = LICENSES.filter(file => files.indexOf(file) !== -1).map(makeTask.bind(this, modulePath));

    parallel(tasks, (err, licensePath) => {
      if (err) return cb(err);

      licensePath = licensePath.reduce((acc, el) => {
        if (el) return el;
        return acc;
      }, false);

      cb(null, licensePath);
    });
  });
}

function getRepo(pkg) {
  if (!pkg.repository) return false;

  const repo = hostedGitInfo.fromUrl(pkg.repository.url || pkg.repository);

  // repo can be empty in some cases, so we must check
  return repo ? repo.browse() : null;
}

function makeTask(modulePath, file) {
  return function task(cb) {
    const where = path.join(modulePath, file);

    fs.stat(where, (err, stats) => {
      if (err && err.code === 'ENOENT') return cb(null, false);
      if (err) return cb(err);

      if (stats.isFile()) return cb(null, where);

      return cb(null, false);
    });
  };
}
