module.exports = ar => {
  ar.sort()
  ar.splice(0, 1) // remove lower value
  ar.splice(-1, 1) // remove high value
  return ar.reduce(function (a, b) {
    return a + b
  }, 0) / ar.length;
}
