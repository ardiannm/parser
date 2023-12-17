import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { SyntaxKind } from "./SyntaxKind";
import { SyntaxToken } from "./SyntaxToken";
import { SourceText } from "../SourceText/SourceText";
import { Binder } from "../Binder/Binder";
import { BoundNode } from "../Binder/BoundNode";
import { BoundProgram } from "../Binder/BoundProgram";
import { BoundScope } from "../Binder/BoundScope";

export class SyntaxTree {
  private constructor(public Root: BoundNode) {}

  static *Lex(Text: string) {
    const Tokenizer = new Lexer(SourceText.From(Text));
    var Token: SyntaxToken;
    do {
      Token = Tokenizer.Lex();
      switch (Token.Kind) {
        case SyntaxKind.NewLineToken:
        case SyntaxKind.SpaceToken:
        case SyntaxKind.CommentToken:
          continue;
      }
      yield Token;
    } while (Token.Kind !== SyntaxKind.EndOfFileToken);
  }

  static Parse(Text: string) {
    const Source = SourceText.From(Text);
    return new Parser(Source).Parse();
  }

  static Bind(Text: string) {
    const Source = SourceText.From(Text);
    const Tree = new Parser(Source).Parse();
    return new Binder().Bind(Tree) as BoundProgram;
  }
}