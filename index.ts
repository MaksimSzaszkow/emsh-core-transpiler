import {
  readdir,
  stat,
  rm,
  mkdir,
  access,
  writeFile,
  readFile,
} from "fs/promises";
import { constants } from "fs";
import { CoreTranspiler } from "./Transpiler";

async function main() {
  try {
    if (process.argv.length === 3) {
      try {
        await access("eco", constants.R_OK | constants.W_OK);
        await rm("eco", { recursive: true });
      } catch (err) {}

      processFolder(process.argv[2]);
    } else throw new Error("No root folder was passed as argument");
  } catch (err) {
    console.log(err);
  }
}

async function processFolder(path: string) {
  await mkdir(generateEcoPath(path));
  const folderContents = await readdir(path);

  folderContents.forEach(async (fileOrDir) => {
    const fileOrDirPath = `${path}/${fileOrDir}`;
    const stats = await stat(fileOrDirPath);
    if (stats.isDirectory()) processFolder(fileOrDirPath);
    else if (stats.isFile() && fileOrDirPath.endsWith(".emsh"))
      processFile(fileOrDirPath, fileOrDir);
  });
}

async function processFile(path: string, name: string) {
  try {
    const code = await readFile(path);
    const ECO = CoreTranspiler.processFile(
      code.toString(),
      name.replace(".emsh", "")
    );
    await writeFile(generateEcoPath(path), JSON.stringify(ECO));
  } catch (err) {
    console.log(err);
  }
}

function generateEcoPath(path: string) {
  if (path.endsWith(".emsh")) path = path.replace(/.emsh$/, ".json");
  const pathArr = path.split("/");
  pathArr[0] = "eco";
  return pathArr.join("/");
}

main();
