const fs = require("fs");
const path = require("path");

function getCruFilesContent(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      let promises = files.map((file) => {
        let fullPath = path.join(directory, file.name);
        if (file.isDirectory()) {
          return getCruFilesContent(fullPath);
        } else if (file.isFile() && path.extname(file.name) === ".cru") {
          return fs.promises.readFile(fullPath, "utf8");
        }
      });

      Promise.all(promises)
        .then((contents) => {
          resolve(contents.filter(Boolean).join(""));
        })
        .catch(reject);
    });
  });
}

module.exports.getCruFilesContent = getCruFilesContent;
