import EmshClass from "./classes/EmshClass";
import EmshFile from "./classes/EmshFile";
import EmshFunction from "./classes/EmshFunction";
import EmshModule from "./classes/EmshModule";

export class CoreTranspiler {
  static code: string[];
  static eco: EmshFile;
  static currentName: string;
  static currentIndex = 0;
  static currentDepth = 0;
  static currentObject:
    | EmshFile
    | EmshModule
    | EmshClass
    | EmshFunction
    | undefined;
  static validName = "[a-zA-Z_][a-zA-Z_0-9]*";

  static transpile(code: string, fileName: string) {
    this.code = code.split("\n");
    this.currentIndex = 0;
    this.currentDepth = 0;
    this.currentName = fileName;

    this.processFile(fileName);
  }

  static processFile(name: string) {
    const file = new EmshFile(name);
    this.eco = this.currentObject = file;

    while (this.currentIndex < this.code.length) {
      this.currentObject = file;
      const line = this.code[this.currentIndex].trim();
      const depth = this.getLineDepth(this.code[this.currentIndex]);

      if (line !== "") {
        if (depth !== 0)
          throw new Error(
            `Syntax error at line ${this.currentIndex + 1} in ${
              this.currentName
            }: file level must be equal to 0 (no indentation)`
          );

        if (this.isImport(line, depth)) continue;
        if (this.isModule(line, depth)) continue;
        throw new Error(
          `Syntax error at line ${this.currentIndex + 1} in ${
            this.currentName
          }: line "${line}" couldn't be processed by CoreTranspiler.processFile`
        );
      }
    }

    return this.eco;
  }

  static isImport(line: string, depth: number) {
    const fileImport = new RegExp(`^import ".*" as ${this.validName}$`);
    const moduleImport = new RegExp(`^from ".*" import ${this.validName}$`);

    if (fileImport.test(line)) {
      this.processImport(line, "file");
      return true;
    }
    if (moduleImport.test(line)) {
      this.processImport(line, "module");
      return true;
    }
    return false;
  }

  static processImport(line: string, type: "file" | "module") {
    if (type === "file") {
    } else {
    }
    this.currentIndex++;
    this.currentDepth = this.getLineDepth(this.code[this.currentIndex]);
  }

  static isModule(line: string, depth: number) {
    const module = new RegExp(`^module ${this.validName}:$`);
    const nameMatch = line.match(new RegExp(`${this.validName}:$`));

    if (module.test(line) && nameMatch) {
      const name = nameMatch[0].replace(":", "");
      this.currentDepth = depth;
      this.processModule(name);
      return true;
    }

    return false;
  }

  static processModule(name: string) {
    const module = new EmshModule(name);
    if (this.currentObject instanceof EmshFile)
      this.currentObject.addModule(module);
    this.currentIndex++;
    this.currentDepth = this.getLineDepth(this.code[this.currentIndex]);

    while (this.currentIndex < this.code.length) {
      this.currentObject = module;

      const line = this.code[this.currentIndex].trim();
      const depth = this.getLineDepth(this.code[this.currentIndex]);

      if (line !== "") {
        if (this.isClass(line, depth)) continue;
        if (this.isFunction(line, depth)) continue;
        if (this.isVariable(line, depth)) continue;
        throw new Error(
          `Syntax error at line ${this.currentIndex + 1} in ${
            this.currentName
          }: line "${line}" couldn't be processed by CoreTranspiler.processModule`
        );
      }
    }
  }

  static isClass(line: string, depth: number) {
    const publicClass = new RegExp(`^public class ${this.validName}:$`);
    const privateClass = new RegExp(
      `(^private class ${this.validName}:$)|(^class ${this.validName}:$)`
    );
    const nameMatch = line.match(`${this.validName}:`);

    if (nameMatch) {
      const name = nameMatch[0].replace(":", "");
      if (publicClass.test(line)) {
        this.processClass("public", name);
        return true;
      }
      if (privateClass.test(line)) {
        this.processClass("private", name);
        return true;
      }
    }

    return false;
  }

  static processClass(scope: "public" | "private", name: string) {
    const emshClass = new EmshClass(name);
    if (this.currentObject instanceof EmshModule)
      this.currentObject.addClass(scope, emshClass);
    this.currentIndex++;
    this.currentDepth = this.getLineDepth(this.code[this.currentIndex]);

    while (this.currentIndex < this.code.length) {
      this.currentObject = emshClass;

      const line = this.code[this.currentIndex].trim();
      const depth = this.getLineDepth(this.code[this.currentIndex]);

      if (line !== "") {
        if (depth < this.currentDepth) break;

        if (this.isFunction(line, depth)) continue;
        if (this.isVariable(line, depth)) continue;
      }
    }
  }

  static isFunction(line: string, depth: number) {
    if (depth !== 1 && depth !== 2)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: functions can only be defined at module and class level`
      );
    return false;
  }

  static processFunction() {}

  static isTimesLoop(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: loops can only be defined at function level and above`
      );
    return false;
  }

  static processTimesLoop() {}

  static isForLoop(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: loops can only be defined at function level and above`
      );
    return false;
  }

  static processForLoop() {}

  static isForInLoop(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: loops can only be defined at function level and above`
      );
    return false;
  }

  static processForInLoop() {}

  static isForOfLoop(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: loops can only be defined at function level and above`
      );
    return false;
  }

  static processForOfLoop() {}

  static isWhileLoop(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: loops can only be defined at function level and above`
      );
    return false;
  }

  static processWhileLoop() {}

  static isDoWhileLoop(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: loops can only be defined at function level and above`
      );
    return false;
  }

  static processDoWhileLoop() {}

  static isIfStatement(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: conditional statements can only be defined at function level and above`
      );
    return false;
  }

  static processIfStatement() {}

  static isIfElseStatement(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: conditional statements can only be defined at function level and above`
      );
    return false;
  }

  static processIfElseStatement() {}

  static isElseStatement(line: string, depth: number) {
    if (depth < 3)
      throw new Error(
        `Syntax error at line ${this.currentIndex + 1} in ${
          this.currentName
        }: conditional statements can only be defined at function level and above`
      );
    return false;
  }

  static processElseStatement() {}

  static isAssigment(line: string, depth: number) {
    return false;
  }

  static processAssigment() {}

  static isExpression(line: string, depth: number) {
    return false;
  }

  static processExpression() {}

  static isVariable(line: string, depth: number) {
    return false;
  }

  static processVariable() {}

  static getLineDepth(line: string) {
    let depth = 0;
    console.log(line);

    while (line.startsWith(" ")) {
      depth++;
      line = line.replace(" ", "");
    }
    return depth;
  }
}
