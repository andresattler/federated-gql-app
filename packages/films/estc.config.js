module.exports = {
  outDir: "./dist",
  esbuild: {
    minify: false,
    target: "es2019",
  },
  assets: {
    baseDir: "src",
    filePatterns: ["**/*.json"],
  },
};
