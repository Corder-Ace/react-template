const path = require('path');

const getWorkSpacePath = (filePath) => path.resolve(process.cwd(), filePath);

module.exports = {
    getWorkSpacePath,
};