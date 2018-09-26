"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

/**
 * Example:
 *
 * let t = {w,a} = window,
 *     u = [x,b] = arr;
 * // Will be transformed to:
 * //
 * //    let {w,a} = window,
 * // +      t = {w,a},
 * //        [x,b] = arr,
 * // +      u = [x, b];
 * //
 *
 * Minimum of Babel v6 required.
 *
 * @see http://astexplorer.net/#/gist/de66935c4cd9d84ebe574ffb379fd9be/816ed60fe9ecc45d537b987bde9a41398bb80ab7
 */
function _default(babel) {
  var t = babel.types;

  function copyProperty(property) {
    // Do not allow rest property
    if (t.isRestElement(property)) {
      throw property.buildCodeFrameError("You are not allowed to transform an object destructuring with rest property.");
    } // Allow null nodes, they are filtered out...


    if (property.node === null) {
      return null;
    }

    if (t.isIdentifier(property)) {
      // Array
      return t.identifier(property.node.name);
    } else {
      // Object
      return t.objectProperty(t.identifier(property.node.key.name), t.identifier(property.node.key.name), false, // computed
      true // shorthand
      );
    }
  }

  return {
    name: "ast-transform-object-from-destructuring",
    visitor: {
      VariableDeclaration: function VariableDeclaration(path) {
        var declaration,
            node,
            append,
            isObjectPattern,
            isArrayPattern,
            appendedCnt = 0; // Iterate declarations and search for object destructuring

        var declarations = path.get('declarations');

        for (var i = 0; i < declarations.length; i++) {
          declaration = declarations[i];
          node = declaration.node;

          if (node && node.init && node.init.left) {
            isObjectPattern = t.isObjectPattern(node.init.left);
            isArrayPattern = t.isArrayPattern(node.init.left);

            if (t.isIdentifier(node.id) && t.isAssignmentExpression(node.init) && (isObjectPattern || isArrayPattern)) {
              // Found destructuring, create appendable properties and node...
              append = t.variableDeclarator(node.id, (isArrayPattern ? t.arrayExpression : t.objectExpression)(declaration.get('init').get('left').get(isObjectPattern ? 'properties' : 'elements').map(copyProperty).filter(Boolean))); // Remove(*) first assignment: let *t = *{w,a} = window

              node.id = node.init.left;
              node.init = node.init.right; // Append* first modified assignment: let {w,a} = window, t = {w,a}

              path.node.declarations.splice(i + 1 + appendedCnt, 0, append);
              appendedCnt++;
            }
          }
        }
      }
    }
  };
}
//# sourceMappingURL=index.js.map