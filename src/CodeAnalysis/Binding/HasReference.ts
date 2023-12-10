import { BoundExpression } from "./BoundExpression";
import { BoundKind } from "./BoundKind";

export class HasReference extends BoundExpression {
  constructor(public Kind: BoundKind, public Reference: string) {
    super(Kind);
  }
}