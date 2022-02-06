const fs = require('fs');

export default async function getFiles(dir: any, suffix: any) {
  const files = fs.readdirSync(dir, {
    withFileTypes: true
  });
  console.log(files)
  let commandFiles: any = [];

  // files.forEach(file: any => {
  //   if (file.isDirectory()) {
  //     commandFiles = [
  //       ...commandFiles,
  //       ...getFiles(`${dir}/${file.name}`, suffix)
  //     ]
  //   } else if (file.name.endsWith(suffix)) {
  //     commandFiles.push(`${dir}/${file.name}`);
  //   }
  // })
  return commandFiles;
}