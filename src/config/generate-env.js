const setEnv = () => {
  const fs = require("fs");
  const writeFile = fs.writeFile;
  const path = require("path");
  const targetPath = path.join(__dirname, "/environment.ts");

  const configFile = `export const environment = {
    wp_appUser: '${process.env.NATIONSOUND_WP_APP_USER}',
    wp_appPwd: '${process.env.NATIONSOUND_WP_APP_PWD}',
    production: true,
  };`;
  writeFile(targetPath, configFile, (err) => {
    if (err) console.error(err);
    else
      console.log(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      );
  });
};

setEnv();
