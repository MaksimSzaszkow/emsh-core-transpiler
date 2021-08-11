export default class EmshFunction {
  type = "function";
  name;
  params: any[] = [];
  body: any[] = [];
  return: any;

  constructor(name: string, params: any[] | undefined) {
    this.name = name;
    if (params) this.params = params;
  }
}
