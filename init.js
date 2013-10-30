var util = require('util')


Recipe.prototype.nextLineRangeForRange = function (rng, callback) {
  var line     = this.rangeOfLinesInRange(rng)
  var nextLine = this.contentRangeOfLinesInRange(new Range(line.max(),0))

  if (line.max() >= Document.current().length) return;
  if (!nextLine.isValid())                     return;

  return callback.apply(this, [nextLine])
}

Recipe.prototype.nextLineTextForRange = function (rng, callback) {
  return this.nextLineRangeForRange(rng, function (rng_deep) {
    var nextLineText = this.textInRange(rng_deep)

    return callback.apply(this, [nextLineText, rng_deep])
  })
}

String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

Hooks.addMenuItem("Text/Lines/Join Lines", "control-shift-j", function () {
  Recipe.run(function (recipe) {
    recipe.eachLine(recipe.selection, function (line) {

      recipe.nextLineTextForRange(line.conventionalRange, function (text, rng) {
        return recipe.replaceTextInRange(rng, text.trimLeft())
      })

      var newline = recipe.contentRangeOfLinesInRange(line.contentRange)
      newline = new Range(newline.max(),1)

      if (line.text.endsWith(" "))
        recipe.deleteTextInRange(newline)
      else
        recipe.replaceTextInRange(newline, " ")

      return undefined
    })
  })
})
