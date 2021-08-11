import { open, readdir, stat, rm, mkdir, access, writeFile } from "fs/promises";
import { constants } from "fs";

async function main() {
  try {
    // If root folder was given as argument
    if (process.argv.length === 3) {
      // If eco folder exists remove it for cleanup reasons.
      // Not optimal but sufficient for first emsh version
      try {
        await access("eco", constants.R_OK | constants.W_OK);
        await rm("eco", { recursive: true });
      } catch (err) {}

      // Start processing project structure
      processFolder(process.argv[2]);
    } else throw new Error("No root folder was passed as argument");
  } catch (err) {
    console.log(err);
  }
}

async function processFolder(path: string) {
  // For each folder create it's eco counterpart
  await mkdir(generateEcoPath(path));

  // Get root folder contents and process them
  const contents = await readdir(path);
  contents.forEach(async (c) => {
    c = `${path}/${c}`;
    const stats = await stat(c);
    if (stats.isDirectory()) processFolder(c);
    else if (stats.isFile() && c.endsWith(".emsh")) processEmshFile(c);
  });
}

async function processEmshFile(path: string) {
  let filehandle;
  try {
    filehandle = await open(path, "r");
    const content = await filehandle.read();
    console.log(content.buffer.toString());
    await writeFile(
      generateEcoPath(path.replace(/.emsh$/, ".eco")),
      content.buffer
    );
  } catch (err) {
    console.log(`Error while accessing path "${path}": ${err}`);
  } finally {
    await filehandle?.close();
  }
}

function generateEcoPath(path: string) {
  const pathArr = path.split("/");
  pathArr[0] = "eco";
  return pathArr.join("/");
}

main();
