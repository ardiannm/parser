import { ColorPalette } from "../../View/ColorPalette";
import { TextSpan } from "../../Input/TextSpan";
import { SyntaxKind } from "./Kind/SyntaxKind";

export class SyntaxNode {
  constructor(public Kind: SyntaxKind) {}

  *Children(): Generator<SyntaxNode> {
    for (const Data of Object.values(this)) {
      if (Array.isArray(Data)) for (const Iteration of Data) yield Iteration;
      if (Data instanceof SyntaxNode) yield Data;
    }
  }

  First(): SyntaxNode {
    return this.Children().next().value as SyntaxNode;
  }

  Last() {
    var LastNode: SyntaxNode = this.First();
    for (const Node of this.Children()) LastNode = Node;
    return LastNode;
  }

  TextSpan(): TextSpan {
    const FirstSpan = this.First().TextSpan();
    return FirstSpan.Input.SetTextSpan(FirstSpan.Start, this.Last().TextSpan().End);
  }

  Print(Indent = "") {
    var Text = ColorPalette.Default(this.Kind);
    for (const Child of this.Children()) {
      Text += "\n" + Indent;
      if (Child === this.Last()) {
        Text += ColorPalette.Gray("└── ") + Child.Print(Indent + "   ");
      } else {
        Text += ColorPalette.Gray("├── ") + Child.Print(Indent + ColorPalette.Gray("│  "));
      }
    }
    return Text;
  }
}