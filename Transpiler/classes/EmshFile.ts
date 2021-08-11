import EmshModule from "./EmshModule";

export default class EmshFile {
  type = "file";
  name;
  imports: EmshModule[] = [];
  contains: EmshModule[] = [];
  exports: EmshModule[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addImport(module: EmshModule) {
    if (this.imports.findIndex((mod) => mod.name === module.name) === -1)
      this.imports.push(module);
  }

  addExport(module: EmshModule) {
    if (this.exports.findIndex((mod) => mod.name === module.name) === -1)
      this.exports.push(module);
  }

  createModule(name: string) {
    const module = this.contains.find((mod) => mod.name === name);
    if (!module) {
      const newModule = new EmshModule(name);
      this.contains.push(newModule);
      return newModule;
    } else return module;
  }

  removeImport(module: EmshModule) {
    for (let i = 0; i < this.imports.length; i++) {
      if (this.imports[i].name === module.name) {
        this.imports.splice(i, 1);
        break;
      }
    }
  }

  removeExport(module: EmshModule) {
    for (let i = 0; i < this.exports.length; i++) {
      if (this.exports[i].name === module.name) {
        this.exports.splice(i, 1);
        break;
      }
    }
  }

  toEco() {
    return JSON.stringify({
      type: "file",
      imports: this.imports,
      contains: this.contains,
      exports: this.exports,
    });
  }
}
