import { SyntaxNode } from "./syntax.node";
import { Parser } from "../parser";
import { Binder } from "../binder";
import { BoundNode } from "../binder/bound.node";
import { BoundNumericLiteral } from "../binder/numeric.literal";
import { BoundKind } from "../binder/kind/bound.kind";
import { Evaluator } from "../../evaluator";
import { SyntaxNodeKind } from "./kind/syntax.node.kind";
import { CompilerOptions } from "../../compiler.options";
import { CompilerConfig } from "../../compiler.config";
import { DiagnosticBag } from "../diagnostics/diagnostic.bag";
import { Submission } from "../input/submission";

export class SyntaxTree {
  EvaluatorService: Evaluator;
  Tree: SyntaxNode;
  BoundTree: BoundNode;

  BinderService: Binder;

  Value = 0;

  private constructor(public Diagnostics: DiagnosticBag, private Configuration: CompilerOptions) {
    this.BinderService = new Binder(this.Diagnostics, this.Configuration);
    this.EvaluatorService = new Evaluator(this.Diagnostics);
    this.Tree = new SyntaxNode(SyntaxNodeKind.BadToken);
    this.BoundTree = new BoundNumericLiteral(BoundKind.NumericLiteral, 0) as BoundNode;
  }

  static Init(Settings: CompilerConfig) {
    const Diagnostics = new DiagnosticBag();
    return new SyntaxTree(Diagnostics, new CompilerOptions(Settings));
  }

  Parse(Text: string) {
    this.BinderService.Scope.ClearUndeclared();
    this.Diagnostics.Clear();
    const Input = Submission.From(Text, this.Diagnostics);
    const ParserService = new Parser(Input, this.Diagnostics);
    this.Tree = ParserService.Parse();
    return this;
  }

  Bind() {
    if (this.Diagnostics.None()) {
      this.BoundTree = this.BinderService.Bind(this.Tree);
    }
    return this;
  }

  Evaluate() {
    if (this.Diagnostics.None()) {
      this.Value = this.EvaluatorService.Evaluate(this.BoundTree);
    }
    return this;
  }

  Clear() {
    this.Diagnostics.Clear();
  }
}