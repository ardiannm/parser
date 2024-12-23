import { Cell } from "../../cell";
import { BoundCellReference } from "./bound.cell.reference";
import { BoundNode } from "./bound.node";
import { BoundScope } from "./bound.scope";
import { BoundKind } from "./bound.kind";
import { Span } from "../lexing/span";

export class BoundCellAssignment extends BoundNode {
  constructor(public scope: BoundScope, public reference: Cell, public expression: BoundNode, public dependencies: Array<BoundCellReference>, public override span: Span) {
    super(BoundKind.BoundCellAssignment, span);

    this.cleanupExistingNode();
    this.registerSelf();

    if (!this.checkForCircularDependency()) {
      this.storeNewAssignment();
    }
  }

  private cleanupExistingNode(): void {
    const existingNode = this.scope.assignments.get(this.reference.name);
    if (!existingNode) return;
    for (const dependency of existingNode.dependencies) {
      const observers = dependency.observers;
      observers.delete(existingNode);
      if (observers.size === 0) this.scope.observers.delete(dependency.name);
    }
  }

  private registerSelf() {
    this.dependencies.forEach((node) => node.observers.add(this));
  }

  private storeNewAssignment() {
    this.scope.assignments.set(this.reference.name, this);
  }

  get observers() {
    var observers: Set<BoundCellAssignment>;
    if (this.scope.observers.has(this.reference.name)) {
      observers = this.scope.observers.get(this.reference.name)!;
    } else {
      observers = new Set<BoundCellAssignment>();
      this.scope.observers.set(this.reference.name, observers);
    }
    return observers;
  }

  private checkForCircularDependency() {
    let index = 0;
    let isCircular = false;
    const chain: DependencyLink[] = [DependencyLink.createFrom(this)];
    while (chain.length) {
      const { done, dependency } = chain[chain.length - 1].next();
      if (done) {
        chain.pop();
      } else {
        const node = DependencyLink.createFrom(dependency.assignment);
        chain.push(node);
        if (this.reference.name === dependency.name) {
          this.scope.diagnostics.reportCircularDependencyDetected(this.dependencies[index].span, chain);
          chain.length = 1;
          isCircular = true;
        }
      }
      if (chain.length === 1) {
        index++;
      }
    }
    return isCircular;
  }
}

export class DependencyLink {
  private constructor(public node: BoundCellAssignment, private generator: Generator<BoundCellReference>) {}

  static createFrom(node: BoundCellAssignment) {
    const generator = (function* (set) {
      for (const item of set) {
        yield item;
      }
    })(node.dependencies);
    return new DependencyLink(node, generator);
  }

  next() {
    const { done, value: dependency } = this.generator.next();
    return { done, dependency };
  }
}
