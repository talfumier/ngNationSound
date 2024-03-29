const setEnv = () => {
  const fs = require("fs");
  const writeFile = fs.writeFile;
  const path = require("path");
  const targetPath = path.join(__dirname, "/environment.ts");

  const configFile = `export const environment = {
    apiMode: '${process.env.NATIONSOUND_API_MODE}',
    appUser: '${process.env.NATIONSOUND_APP_USER}',
    appPwd: '${process.env.NATIONSOUND_APP_PWD}',
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
