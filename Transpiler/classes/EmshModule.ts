import EmshClass from "./EmshClass";
import EmshFunction from "./EmshFunction";

export default class EmshModule {
  type = "module";
  name;
  public = new EmshModuleContent();
  private = new EmshModuleContent();

  constructor(name: string) {
    this.name = name;
  }

  addClass(scope: ModuleScope, emshClass: EmshClass) {
    if (!this[scope].classes.find((c) => c.name === emshClass.name))
      this[scope].classes.push(emshClass);
  }

  removeClass(scope: ModuleScope, name: string) {}

  createFunction(scope: ModuleScope, name: string, params: any[]) {
    const newFunction = new EmshFunction(name, params);
    this[scope].functions.push(newFunction);
    return newFunction;
  }

  removeFunction(scope: ModuleScope, name: string) {}

  createVariable() {}

  removeVariable() {}

  toEco() {
    return JSON.stringify({
      type: "module",
      name: this.name,
      public: this.public,
      private: this.private,
    });
  }
}

export class EmshModuleContent {
  classes: EmshClass[] = [];
  functions: EmshFunction[] = [];
  variables = [];
}

export type ModuleScope = "public" | "private";
