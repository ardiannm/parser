// import { Parser } from "https://deno.land/x/amparser@v0.0.3/mod.ts";
import { Interpreter } from "./interpreter.ts";
import { Parser } from "./mod.ts";

while (true) {
  console.log();
  const input = prompt(">>") || "";
  const token = new Parser(input).parse();

  const interpreter = new Interpreter();
  const value = interpreter.evaluate(token);
  console.log(value);
}