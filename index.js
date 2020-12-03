const fs = require('jsonfile');
const fsOld = require('fs');
const sha256 = require('sha256');
const del = require('delete');
const rimraf = require('rimraf');

class shardb {
  constructor(init) {
    this.dir = init.dir;
    this.identifier = init.identifier;

    // If the specified directory does not exist, we create it
    if (!fsOld.existsSync(init.dir)) {
      fsOld.mkdirSync(init.dir);
    }

    // Instantiate the global variables
    var _this = this;

    // Returns a sha256 hash as the filename, with a prefix for the correct directory
    this.getFileName = function (identifier) {
      return _this.dir + sha256(identifier);
    };

    // Caution: Highly destructive. Deletes the entire DB
    this.selfDestruct = async function () {
      rimraf(_this.dir, function (err, result) {
        if (err) return console.log('self destruct error for ' + _this.dir, err);
        return;
      });
    };

    // Returns the file name and directory for a given primary key
    this.getOne = function (identifier) {
      return loadFile(_this.getFileName(identifier));
    };

    // Returns the entire collection and filenames
    // TODO expand support for filter object
    this.get = function () {
      return new Promise(async function (resolve, reject) {
        var files = fsOld.readdirSync(_this.dir);
        var shards = [];
        for (var file of files) {
          var shard = await loadFile(_this.dir + file);
          if (shard) {
            shard.fileName = _this.getFileName(shard[_this.identifier]);
            shards.push(shard);
          }
        }
        resolve(shards);
      });
    };

    // Returns an updated file, accepts update diff only (JSON)
    this.update = async function (identifier, update) {
      return new Promise(async function (resolve, reject) {
        var file = await _this.getOne(identifier);

        for (var key of Object.keys(update)) {
          file[key] = update[key];
        }

        fs.writeFile(_this.getFileName(identifier), file, function (err) {
          if (err) reject(err);
          resolve({
            success: true,
            fileName: _this.getFileName(identifier),
          });
        });
      });
    };

    // Deletes the entire collection item
    this.delete = async function (identifier) {
      return new Promise(async function (resolve, reject) {
        del
          .promise([_this.getFileName(identifier)])
          .then((deleted) => resolve(deleted))
          .catch((err) => reject(err));
      });
    };

    // Creates a new collection item (must contain a valid primary key)
    this.create = async function (payload) {
      return new Promise(async function (resolve, reject) {
        fs.writeFile(
          _this.getFileName(payload[_this.identifier]),
          payload,
          function (err) {
            if (err) reject(err);
            resolve({
              success: true,
              fileName: _this.getFileName(payload[_this.identifier]),
            });
          }
        );
      });
    };
  }
}

// Extracts data from json filestores
async function loadFile(fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName)
      .then((file) => {
        resolve(file);
      })
      .catch((err) => {
        resolve(undefined);
      });
  });
}

module.exports = shardb;
