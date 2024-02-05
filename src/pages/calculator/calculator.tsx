/* @refresh reload */
import { render } from "solid-js/web";

import "@style";
import { useEvent } from "@hooks";
import { BackendEvent, KeyEvent, ExpressionParser } from "@lib";
import { For, createEffect, createSignal, onMount } from "solid-js";

const Calculator = () => {
  const [parser, setParser] = createSignal<ExpressionParser>();
  const [expr, setExpr] = createSignal<string>("");
  const [result, setResult] = createSignal<number>(0);
  const [history, setHistory] = createSignal<string[]>([]);

  onMount(() => {
    setParser(new ExpressionParser(""));
  });

  createEffect(() => {
    parser()?.setExpression(expr());
  });

  let inputRef: HTMLInputElement;

  useEvent(BackendEvent.ShowCalculator, () => {
    inputRef.focus();
  });

  const onInput = (e: KeyEvent) => {
    setExpr(e.target.value);

    if (e.target.value === "") {
      setResult(0);
      return;
    }

    setResult(parser()?.evaluate() ?? 0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "(") {
      e.preventDefault();

      let pos = inputRef.selectionStart!;
      let newVal = expr().slice(0, pos) + "()" + expr().slice(pos);

      setExpr(newVal);

      inputRef.setSelectionRange(pos + 1, pos + 1);
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (expr() === "") return;
      else if (expr() === "clear") {
        setHistory([]);
        setExpr("");
        setResult(0);
      } else {
        setHistory(h => [`${expr()} = ${result()}`, ...h]);
        setExpr("");
        setResult(0);
      }
    }
  };

  return (
    <div class="w-screen h-screen flex flex-col bg-[#1D1919] text-white">
      <div class="w-full h-16 flex items-center p-2">
        <p class="ml-1">{">"}</p>
        <input
          ref={inputRef!}
          class="!w-full !p-2"
          spellcheck={false}
          style={{ all: "unset" }}
          value={expr()}
          onKeyDown={onKeyDown}
          onInput={onInput}
        />
      </div>
      <div class="w-full h-16 items-center p-4 text-yellow-500 text-2xl flex-shrink-0">
        {result() !== null ? result() : ""}
      </div>
      <div class="w-full p-2">⏱️ History</div>
      <div class="w-full items-center p-4 overflow-auto overflow-x-hidden text-ellipsis whitespace-nowrap">
        <For each={history()}>{h => <div class="w-full p-2">{h}</div>}</For>
      </div>
    </div>
  );
};

render(() => <Calculator />, document.getElementById("root")!);
