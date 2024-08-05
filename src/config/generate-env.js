const setEnv = () => {
  const fs = require("fs");
  const writeFile = fs.writeFile;
  const path = require("path");
  const targetPath = path.join(__dirname, "/environment.ts");

  const configFile = `export const environment = {
    node_api_url_prod: '${process.env.NATIONSOUND_API_URL}',
    wp_appUser: '${process.env.NATIONSOUND_WP_APP_USER}',
    wp_appPwd: '${process.env.NATIONSOUND_WP_APP_PWD}',
    wp_api_std_url: '${process.env.NATIONSOUND_WP_API_STD_URL}',
    wp_api_upload_url: '${process.env.NATIONSOUND_WP_API_UPLOAD_URL}',
    wp_ticketing_url: '${process.env.NATIONSOUND_WP_TICKETING_URL}',
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
