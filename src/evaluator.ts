import { BoundBinaryExpression } from "./analysis/binder/bound.binary.expression";
import { BoundBlock } from "./analysis/binder/bound.block";
import { BoundCellAssignment } from "./analysis/binder/bound.cell.assignment";
import { BoundCellReference } from "./analysis/binder/bound.cell.reference";
import { BoundCompilationUnit } from "./analysis/binder/bound.compilation.unit";
import { BoundNode } from "./analysis/binder/bound.node";
import { BoundNumericLiteral } from "./analysis/binder/bound.numeric.literal";
import { BoundUnaryExpression } from "./analysis/binder/bound.unary.expression";
import { BoundBinaryOperatorKind } from "./analysis/binder/bound.kind";
import { BoundKind } from "./analysis/binder/bound.kind";
import { BoundUnaryOperatorKind } from "./analysis/binder/bound.kind";
import { DiagnosticsBag } from "./analysis/diagnostics/diagnostics.bag";

export class Evaluator {
  private value = 0;

  constructor(private diagnostics: DiagnosticsBag) {}

  evaluate<Kind extends BoundNode>(node: Kind): number {
    type NodeType<T> = Kind & T;
    switch (node.kind) {
      case BoundKind.BoundCompilationUnit:
        return this.evaluateBoundCompilationUnit(node as NodeType<BoundCompilationUnit>);
      case BoundKind.BoundBlock:
        return this.evaluateBoundBlock(node as NodeType<BoundBlock>);
      case BoundKind.BoundCellAssignment:
        return this.evaluateBoundCellAssignment(node as NodeType<BoundCellAssignment>);
      case BoundKind.BoundCellReference:
        return this.evaluateBoundCellReference(node as NodeType<BoundCellReference>);
      case BoundKind.BoundBinaryExpression:
        return this.evaluateBoundBinaryExpression(node as NodeType<BoundBinaryExpression>);
      case BoundKind.BoundUnaryExpression:
        return this.evaluateBoundUnaryExpression(node as NodeType<BoundUnaryExpression>);
      case BoundKind.BoundNumericLiteral:
        return this.evaluateBoundNumericLiteral(node as NodeType<BoundNumericLiteral>);
    }
    this.diagnostics.evaluatorMethod(node.kind, node.span);
    return 0;
  }

  private evaluateBoundCellReference(node: BoundCellReference): number {
    return node.assignment.reference.value;
  }

  private evaluateBoundCompilationUnit(node: BoundCompilationUnit): number {
    for (const statement of node.root) this.value = this.evaluate(statement);
    return this.value;
  }

  private evaluateBoundBlock(node: BoundBlock): number {
    for (const statement of node.statements) this.value = this.evaluate(statement);
    return this.value;
  }

  private evaluateBoundCellAssignment(node: BoundCellAssignment) {
    const value = (node.reference.value = this.evaluate(node.expression));
    return value;
  }

  private evaluateBoundBinaryExpression(node: BoundBinaryExpression): number {
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);
    switch (node.operatorKind) {
      case BoundBinaryOperatorKind.Addition:
        return left + right;
      case BoundBinaryOperatorKind.Subtraction:
        return left - right;
      case BoundBinaryOperatorKind.Multiplication:
        return left * right;
      case BoundBinaryOperatorKind.Division:
        return left / right;
      case BoundBinaryOperatorKind.Exponentiation:
        return left ** right;
    }
  }

  private evaluateBoundUnaryExpression(node: BoundUnaryExpression): number {
    const right = this.evaluate(node.right);
    switch (node.operatorKind) {
      case BoundUnaryOperatorKind.Identity:
        return right;
      case BoundUnaryOperatorKind.Negation:
        return -right;
    }
  }

  private evaluateBoundNumericLiteral(node: BoundNumericLiteral) {
    return node.value;
  }
}