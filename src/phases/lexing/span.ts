import { Location } from "./location"
import { SourceText } from "./source.text"

export class Span {
  private constructor(public source: SourceText, public start: number, public end: number) {}

  static createFrom(source: SourceText, start: number, end: number) {
    return new Span(source, start, end)
  }

  get text(): string {
    return this.source.text.substring(this.start, this.end)
  }

  get length() {
    return this.end - this.start
  }

  get from() {
    return Location.createFom(this.source.getLine(this.start).number, this.source.getColumn(this.start))
  }

  get to() {
    return Location.createFom(this.source.getLine(this.end).number, this.source.getColumn(this.end))
  }

  get address() {
    return this.from.address + ":" + this.to.address
  }
}
