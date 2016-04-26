const _path = require('path');
const projectRoot = _path.resolve(_path.dirname(__filename), '../..');

module.exports = function () {
    return {
        visitor: {
            CallExpression: function CallExpression(path) {
                var callee = path.node.callee;

                var modulePath = path.node.arguments[0];
                var calleeIsRequire = callee.type == 'Identifier' && callee.name == 'require';

                var isCloudModulePath = modulePath && modulePath.type == 'StringLiteral' && modulePath.value.indexOf('cloud/') === 0;

                if (calleeIsRequire && isCloudModulePath) {
                    var fromPath = path.hub.file.log.filename.split(_path.win32.sep).join(_path.posix.sep);
                    var targetPath = _path.posix.join(projectRoot, modulePath.value);
                    modulePath.value = _path.posix.relative(fromPath, targetPath);
                }
            }
        }
    };
};