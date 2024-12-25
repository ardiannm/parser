import { SyntaxToken } from "./syntax.token";
import { SourceText } from "./source.text";
import { Span } from "./span";

export class Line {
  private constructor(public source: SourceText, public number: number, public fullSpan: Span, private lineBreakLength: number) {}

  static createFrom(source: SourceText, number: number, start: number, end: number, lineBreakLength: number) {
    return new Line(source, number, Span.createFrom(source, start, end), lineBreakLength);
  }

  get span() {
    return Span.createFrom(this.source, this.fullSpan.start, this.fullSpan.end - this.lineBreakLength);
  }

  *getTokens(): Generator<SyntaxToken> {
    const tokenStart = this.source.getTokenPosition(this.span.start);
    const token = this.source.tokens[tokenStart];
    yield this.trimToken(token);
    if (!this.span.length) {
      return;
    }
    const tokens = this.source.tokens;
    const tokenEnd = this.source.getTokenPosition(this.span.end);
    for (let position = tokenStart + 1; position < tokenEnd; position++) {
      yield tokens[position];
    }
    if (tokenStart < tokenEnd) {
      const token = tokens[tokenEnd];
      yield this.trimToken(token);
    }
  }

  private trimToken(token: SyntaxToken) {
    const lineStart = this.fullSpan.start;
    const lineEnd = this.fullSpan.end;
    let tokenStart = token.span.start;
    let tokenEnd = token.span.end;
    if (tokenStart >= lineStart && tokenEnd <= lineEnd) {
      return token;
    }
    if (tokenStart < lineStart) tokenStart = lineStart;
    if (tokenEnd > lineEnd) tokenEnd = lineEnd;
    return new SyntaxToken(this.source, token.kind, Span.createFrom(this.source, tokenStart, tokenEnd));
  }
}