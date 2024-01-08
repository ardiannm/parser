import { BoundBinaryOperatorKind } from "../CodeAnalysis/Binder/BoundBinaryOperatorKind";
import { BoundKind } from "../CodeAnalysis/Binder/BoundKind";
import { BoundUnaryOperatorKind } from "../CodeAnalysis/Binder/BoundUnaryOperatorKind";
import { SyntaxKind } from "../CodeAnalysis/Parser/SyntaxKind";
import { Diagnostic } from "./Diagnostic";
import { DiagnosticKind } from "./DiagnosticKind";

export class DiagnosticBag {
  private Diagnostics = new Array<Diagnostic>();

  private ReportError(Diagnostic: Diagnostic) {
    this.Diagnostics.push(Diagnostic);
    return Diagnostic;
  }

  get Bag() {
    return this.Diagnostics;
  }

  get Count() {
    return this.Diagnostics.length;
  }

  Any() {
    return this.Count > 0;
  }

  BadTokenFound(Text: string) {
    const Message = `Bad character '${Text}' found`;
    return this.ReportError(new Diagnostic(DiagnosticKind.BadTokenFound, Message));
  }

  TokenMissmatch(Matched: SyntaxKind, ExpectedKind: SyntaxKind) {
    const Message = `Unexpected '${Matched}' found; expecting '${ExpectedKind}'`;
    return this.ReportError(new Diagnostic(DiagnosticKind.TokenNotAMatch, Message));
  }

  EmptyProgram() {
    const Message = `Program contains no code`;
    return this.ReportError(new Diagnostic(DiagnosticKind.EmptyProgram, Message));
  }

  CantDivideByZero() {
    const Message = `Can't divide by zero`;
    return this.ReportError(new Diagnostic(DiagnosticKind.CantDivideByZero, Message));
  }

  MissingOperatorKind(Kind: BoundBinaryOperatorKind | BoundUnaryOperatorKind | SyntaxKind) {
    const Message = `Unexpected operator kind '${Kind}'`;
    return this.ReportError(new Diagnostic(DiagnosticKind.MissingOperatorKind, Message));
  }

  CircularDependency(ForName: string, InName: string) {
    const Message = `Circular dependency for '${ForName}' in '${InName}'`;
    return this.ReportError(new Diagnostic(DiagnosticKind.CircularDependency, Message));
  }

  CantUseAsAReference(Unexpected: string) {
    const Message = `'${Unexpected}' can't be used as a reference`;
    return this.ReportError(new Diagnostic(DiagnosticKind.CantUseAsAReference, Message));
  }

  UndefinedCell(Name: string) {
    const Message = `Cell reference '${Name}' is undefined`;
    return this.ReportError(new Diagnostic(DiagnosticKind.UndefinedCell, Message));
  }

  BadFloatingPointNumber() {
    const Message = `Wrong floating number format`;
    return this.ReportError(new Diagnostic(DiagnosticKind.BadFloatingPointNumber, Message));
  }

  NotARangeMember(Kind: SyntaxKind) {
    const Message = `'${Kind}' is not a range member and it can't be bound`;
    return this.ReportError(new Diagnostic(DiagnosticKind.NotARangeMember, Message));
  }
}