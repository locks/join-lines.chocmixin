var util = require('util')

Recipe.prototype.nextLineInRange = function (rng) {
  line     = this.rangeOfLinesInRange(rng)
  nextLine = this.rangeOfLinesInRange(new Range(line.location+line.length,0))

  return nextLine;
}

String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

Hooks.addMenuItem("Text/Lines/Join Lines", "control-j", function () {
  Recipe.run(function (recipe) {
    recipe.eachLine(recipe.selection, function (line) {
      next_line = recipe.nextLineInRange(line.conventionalRange)

      recipe.eachLine(next_line, function (marker) {
        return marker.text.trimLeft()
      })

      newline = recipe.contentRangeOfLinesInRange(line.contentRange)
      newline = new Range(newline.location+newline.length,1)

      if (line.text.endsWith(" "))
        recipe.deleteTextInRange(newline)
      else
        recipe.replaceTextInRange(newline, " ")

      return undefined;
    })
  })
})
