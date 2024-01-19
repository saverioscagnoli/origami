import { useEvent } from "@hooks";
import { BackendEvent } from "@lib";

function App() {
  let input: HTMLInputElement;

  useEvent<string>(BackendEvent.ShowWindowSwitcher, () => {
    input.focus();
  });

  useEvent<string>(BackendEvent.HideWindowSwitcher, () => {
    input.blur();
  });

  return (
    <div class="w-screen h-screen flex flex-col">
      <div class="w-full h-16 flex items-center gap-2 p-2">
        <p>{">"}</p>
        <input ref={input!} spellcheck={false} class="w-full p-2" />
      </div>
    </div>
  );
}

export { App };
