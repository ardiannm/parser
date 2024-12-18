import { Kind, SyntaxKind } from "./syntax.kind";
import { SyntaxNode } from "./syntax.node";
import { SyntaxToken } from "./syntax.token";

export class SyntaxParenthesis extends SyntaxNode {
  constructor(public left: SyntaxToken<SyntaxKind.OpenParenthesisToken>, public expression: SyntaxNode, public right: SyntaxToken<SyntaxKind.CloseParenthesisToken>) {
    super(left.source, SyntaxKind.SyntaxParenthesis);
  }

  override getFirstChild(): SyntaxToken<Kind> {
    return this.left;
  }

  override getLastChild(): SyntaxToken<Kind> {
    return this.right;
  }
}
