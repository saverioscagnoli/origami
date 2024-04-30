import { ArgsMap, Operation, OperationStatus, OperationType } from "@lib/operations";
import { createSlice } from "@reduxjs/toolkit";
import { Action } from "./store";

const callstackSlice = createSlice({
  name: "callstack",
  initialState: [] as Operation<OperationType>[],
  reducers: {
    push<T extends OperationType>(
      state: Operation<T>[],
      action: Action<{ type: T; args: ArgsMap[T] }>
    ) {
      const { type, args } = action.payload;

      const op: Operation<T> = {
        args,
        type,
        status: OperationStatus.Ready,
        id: window.crypto.randomUUID()
      };

      state.push(op);
    },

    pop<T extends OperationType>(
      state: Operation<T>[],
      action: Action<{ id: string }>
    ) {
      const { id } = action.payload;

      const index = state.findIndex(op => op.id === id);

      if (index !== -1) {
        state.splice(index, 1);
      }
    },

    updateStatus<T extends OperationType>(
      state: Operation<T>[],
      action: Action<{ id: string; status: OperationStatus }>
    ) {
      const { id, status } = action.payload;

      const op = state.find(op => op.id === id);

      if (op) {
        op.status = status;
      }
    }
  }
});

export const { push, pop, updateStatus } = callstackSlice.actions;
export const callstackReducer = callstackSlice.reducer;
