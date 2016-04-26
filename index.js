const path = require('path');

module.exports = function () {
    return {
        visitor: {
            CallExpression: function CallExpression(_path) {
                var callee = _path.node.callee;

                var modulePath = _path.node.arguments[0];
                var calleeIsRequire = callee.type == 'Identifier' && callee.name == 'require';

                var isCloudModulePath = modulePath && modulePath.type == 'StringLiteral' && modulePath.value.indexOf('cloud/') === 0;

                if (calleeIsRequire && isCloudModulePath) {
                    var fromPath = _path.hub.file.log.filename.split(path.win32.sep).join(path.posix.sep);
                    var targetPath = modulePath.value;
                    var relativePath = path.posix.relative(path.dirname(fromPath), targetPath);
                    console.log({fromPath, targetPath, relativePath});
                    modulePath.value = relativePath;
                }
            }
        }
    };
};