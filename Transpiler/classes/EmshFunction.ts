export default class EmshFunction {
  name;
  params: any[] = [];
  body: any[] = [];
  return: any;

  constructor(name: string, params: any[] | undefined) {
    this.name = name;
    if (params) this.params = params;
  }
}
