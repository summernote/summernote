// It is handy to not have those transformations while we developing
if (process.env.NODE_ENV === "production") {
  module.exports = {
    plugins: [require("autoprefixer"), require("cssnano")]
  };
} else if (process.env.NODE_ENV === "development") {
  module.exports = {
    plugins: [require("autoprefixer")]
  };
}
