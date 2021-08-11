import EmshFunction from "./EmshFunction";

export default class EmshClass {
  type = "class";
  name;
  public = new EmshClassContent();
  private = new EmshClassContent();
  static = new EmshClassContent();

  constructor(name: string) {
    this.name = name;
  }

  createFunction(scope: ClassScope, name: string, params: any[]) {
    const newFunction = new EmshFunction(name, params);
    this[scope].functions.push(newFunction);
    return newFunction;
  }

  removeFunction(scope: ClassScope, name: string) {}

  createVariable() {}

  removeVariable() {}
}

export class EmshClassContent {
  functions: EmshFunction[] = [];
  variables = [];
}

export type ClassScope = "private" | "public" | "static";
