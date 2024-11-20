import { SourceText } from "../../lexing/source.text";
import { SyntaxKind } from "./syntax.kind";
import { SyntaxNode } from "./syntax.node";
import { SyntaxToken } from "./syntax.token";

export class SyntaxCellReference extends SyntaxNode {
  constructor(public override sourceText: SourceText, public left: SyntaxToken<SyntaxKind.IdentifierToken>, public right: SyntaxToken<SyntaxKind.NumberToken>) {
    super(sourceText, SyntaxKind.SyntaxCellReference);
  }

  override getFirstChild(): SyntaxToken {
    return this.left.getFirstChild();
  }

  override getLastChild(): SyntaxToken {
    return this.right.getLastChild();
  }
}