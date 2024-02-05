import { Function, Operator, Token } from "./enums";
import { isFunction, isNumber, isOperator } from "./utils";

function precedence(c: Operator) {
  switch (c) {
    case Operator.Factorial:
      return 4;

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

  for (let i = 0; i < expr.length; i++) {
    let c = expr[i];

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
    } else if (c === Operator.Factorial) {
      output.push(n);
      n = "";
      output.push(c);
    } else if (isFunction(c)) {
      let fn = "";
      while (i < expr.length && isFunction(fn + expr[i])) {
        fn += expr[i];
        i++;
      }
      i--; 
      stack.push(fn);
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
      let a = stack.pop()!;
      if (t === Operator.Factorial) {
        let result = 1;
        for (let i = 2; i <= a; i++) {
          result *= i;
        }
        stack.push(result);
      } else if (isFunction(t)) {
        let a = stack.pop()!;
        switch (t) {
          case Function.Sine:
            stack.push(Math.sin(a));
            break;

          case Function.Cosine:
            stack.push(Math.cos(a));
            break;
        }
      } else {
        let b = stack.pop()!;
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
            stack.push(Math.pow(b, a));
            break;

          case Operator.Factorial:
            let result = 1;
            console.log(a);
            for (let i = 2; i <= a; i++) {
              result *= i;
            }
            stack.push(result);
            break;
        }
      }
    }
  }

  return stack.pop()!;
}

export { shuntingYard, evaluate };
