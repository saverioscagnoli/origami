type Payload<T> = {
  opId: string;
  data: T | null;
  error: string | null;
  isFinished: boolean;
};

export type { Payload };
