import { E, PHI, PI } from "./consts";
import { Token } from "./enums";

class ExpressionParser {
  private static readonly Operators = ["+", "*", "-", "/", "^", "!"];
  private static readonly Functions = [
    "sin",
    "cos",
    "tan",
    "sqrt",
    "rng",
    "log"
  ];
  private static readonly Constants = ["pi", "e", "phi"];

  private expr: string;

  public constructor(expr: string) {
    this.expr = expr;
  }

  private isNumber(value: string): boolean {
    return !isNaN(+value);
  }

  private isOperator(value: string): boolean {
    return ExpressionParser.Operators.includes(value);
  }

  private isFunction(value: string): boolean {
    return ExpressionParser.Functions.includes(value);
  }

  private isConstant(value: string): boolean {
    return ExpressionParser.Constants.includes(value);
  }

  private precedence(value: string): number {
    return (
      {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3,
        "!": 4
      }[value] || 0
    );
  }

  public setExpression(expr: string) {
    this.expr = expr;
  }

  private shuntingYard() {
    let stack: string[] = [];
    let output: string[] = [];
    let number = "";
    let func = "";

    for (let i = 0; i < this.expr.length; i++) {
      let char = this.expr[i];

      if (char === " ") continue;

      if (this.isNumber(char) || char === ".") {
        number += char;
        continue;
      }

      if (number) {
        output.push(number);
        number = "";
      }

      if (/[a-z]/i.test(char)) {
        func += char;
        continue;
      }

      if (func) {
        if (this.isConstant(func)) {
          output.push(func);
        } else {
          stack.push(func);
        }
        func = "";
      }

      if (this.isOperator(char) || this.isFunction(char)) {
        if (
          char === "-" &&
          (i === 0 ||
            this.isOperator(this.expr[i - 1]) ||
            this.expr[i - 1] === Token.LeftParen)
        ) {
          number = "-";
          continue;
        }

        while (
          stack.length &&
          char !== Token.LeftParen &&
          this.precedence(char) <= this.precedence(stack.at(-1)!)
        ) {
          output.push(stack.pop()!);
        }
        stack.push(char);
      } else if (char === Token.LeftParen) {
        stack.push(char);
      } else if (char === Token.RightParen) {
        while (stack.length && stack.at(-1)! !== Token.LeftParen) {
          output.push(stack.pop()!);
        }
        if (stack.length) stack.pop(); // Pop the left parenthesis
        if (stack.length && this.isFunction(stack.at(-1)!)) {
          output.push(stack.pop()!);
        }
      }
    }

    if (number) {
      output.push(number);
    }

    if (func) {
      if (this.isConstant(func)) {
        output.push(func);
      } else {
        output.push(func);
      }
    }

    while (stack.length) {
      output.push(stack.pop()!);
    }

    return output;
  }

  public evaluate(): number {
    let rpn = this.shuntingYard();
    let stack: number[] = [];

    for (let token of rpn) {
      if (this.isNumber(token)) {
        stack.push(+token);
      } else if (this.isConstant(token)) {
        switch (token) {
          case "pi":
            stack.push(PI);
            break;
          case "e":
            stack.push(E);
            break;
          case "phi":
            stack.push(PHI);
            break;
        }
      } else if (this.isOperator(token)) {
        let a = stack.pop()!;
        if (token === "!") {
          if (a > 170) {
            stack.push(Infinity);
          } else {
            let result = 1;
            for (let i = 2; i <= a; i++) {
              result *= i;
            }
            stack.push(result);
          }
        } else {
          let b = stack.pop()!;
          switch (token) {
            case "+":
              stack.push(b + a);
              break;
            case "-":
              stack.push(b - a);
              break;
            case "*":
              stack.push(b * a);
              break;
            case "/":
              stack.push(b / a);
              break;
            case "^":
              stack.push(Math.pow(b, a));
              break;
          }
        }
      } else if (this.isFunction(token)) {
        let a = stack.pop()!;
        let radian = a * (Math.PI / 180);

        switch (token) {
          case "sin":
            stack.push(+Math.sin(radian).toFixed(11));
            break;

          case "cos":
            stack.push(+Math.cos(radian).toFixed(11));
            break;

          case "tan":
            if (a % 180 === 90 || a % 180 === -90) {
              stack.push(Infinity);
            } else {
              stack.push(+Math.tan(radian).toFixed(11));
            }
            break;

          case "sqrt":
            if (a < 0) {
              stack.push(NaN);
            } else {
              stack.push(Math.sqrt(a));
            }
            break;

          case "log":
            stack.push(Math.log(a));
            break;

          case "rng":
            stack.push(Math.floor(Math.random() * (a + 1)));
            break;
        }
      }
    }

    return stack.pop()!;
  }
}

export { ExpressionParser };
