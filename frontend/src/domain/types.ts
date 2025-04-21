export type Nullable<T> = T | null;
export type CommandResponse =
  | {
      success: true;
      reason: null;
    }
  | {
      success: false;
      reason: string;
    };
