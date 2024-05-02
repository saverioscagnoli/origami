type Payload<T> = {
  opId: string;
  data: T;
  error: string | null;
  isFinished: boolean;
};

export type { Payload };
