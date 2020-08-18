module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      "@babel/env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: { version: 3, proposals: true },
      },
    ],
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
  ];
  const ignore = [
    (filename) => {
      return !/^(((?!node_modules).)*(js|vue))|(.*(node_modules).*(aaa).*(\.js))$/.test(
        filename
      );
    },
  ];

  return {
    presets,
    plugins,
    ignore,
    // 让babel和webpack一样严格区分commonJS文件和ES6文件
    sourceType: "unambiguous",
  };
};
