export default class Logger {
  private error = this.constructor.name;
  constructor(public message: string, public from: number, public to: number) {
    this.message = `${this.constructor.name}: ${message}, error happened at position ${from}-${to}`;
  }
}