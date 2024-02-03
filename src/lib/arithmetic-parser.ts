import { Operator, Token } from "./enums";
import { isNumber, isOperator } from "./utils";

function precedence(c: Operator) {
  switch (c) {
    case Operator.Power:
      return 3;

    case Operator.Multiply:
    case Operator.Divide:
      return 2;

    case Operator.Add:
    case Operator.Subtract:
      return 1;

    default:
      return 0;
  }
}

function shuntingYard(expr: string) {
  let stack: string[] = [];
  let output: string[] = [];
  let n = "";
  let lastToken = "";

  for (let c of expr) {
    if (c === " ") continue;

    if (isNumber(c) || c === "," || c === ".") {
      n += c === "," ? "." : c;
    } else if (c === "-") {
      if (n !== "") {
        output.push(n);
        n = "";
      }

      if (
        lastToken === "" ||
        isOperator(lastToken) ||
        lastToken === Token.LeftParen
      ) {
        // Unary minus
        n += c;
      } else {
        // Binary minus
        while (
          stack.length &&
          isOperator(stack.at(-1)!) &&
          precedence(c as Operator) <= precedence(stack.at(-1)! as Operator)
        ) {
          let op = stack.pop()!;
          output.push(op);
        }
        stack.push(c);
      }
    } else {
      if (n !== "") {
        output.push(n);
        n = "";
      }

      if (c === Token.LeftParen) {
        stack.push(c);
      } else if (c === Token.RightParen) {
        while (stack.length && stack.at(-1) !== Token.LeftParen) {
          let op = stack.pop()!;
          output.push(op);
        }

        stack.pop();
      } else if (isOperator(c)) {
        while (
          stack.length &&
          isOperator(stack.at(-1)!) &&
          precedence(c as Operator) <= precedence(stack.at(-1)! as Operator)
        ) {
          let op = stack.pop()!;
          output.push(op);
        }
        stack.push(c);
      }
    }

    lastToken = c;
  }

  if (n !== "") {
    output.push(n);
  }

  while (stack.length) {
    let op = stack.pop()!;
    output.push(op);
  }

  return output.map(t => t.trim());
}

function evaluate(rpn: string[]): number {
  let stack: number[] = [];

  for (let t of rpn) {
    if (isNumber(t)) {
      stack.push(+t);
    } else if (isOperator(t)) {
      let b = stack.pop()!;
      let a = stack.pop()!;

      switch (t) {
        case Operator.Add:
          stack.push(a + b);
          break;

        case Operator.Subtract:
          stack.push(a - b);
          break;

        case Operator.Multiply:
          stack.push(a * b);
          break;

        case Operator.Divide:
          stack.push(a / b);
          break;

        case Operator.Power:
          stack.push(Math.pow(a, b));
          break;
      }
    }
  }

  return stack.pop()!;
}

export { shuntingYard, evaluate };
