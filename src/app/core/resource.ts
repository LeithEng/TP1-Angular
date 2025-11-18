import { signal, WritableSignal } from '@angular/core';

export type LoaderParams<R, P, T> = {
  request: R;
  abortSignal: AbortSignal;
  previous?: T;
  params?: P;
};

export function resource<T, R = unknown, P = unknown>(opts: {
  // function returning the current request payload (can read component signals)
  request: () => R;
  // loader that returns a Promise<T>
  loader: (ctx: LoaderParams<R, P, T>) => Promise<T>;
  defaultValue: T;
}) {
  const value = signal<T>(opts.defaultValue);
  let controller: AbortController | null = null;

  async function trigger() {
    const req = opts.request();
    // abort previous
    if (controller) controller.abort();
    controller = new AbortController();
    try {
      const res = await opts.loader({
        request: req,
        abortSignal: controller.signal,
        previous: value(),
      });
      value.set(res);
    } catch (err: any) {
      if (err && err.name === 'AbortError') return;
      console.error('resource loader error:', err);
    }
  }

  // initial trigger
  trigger();

  return {
    value,
    trigger,
    read: () => value(),
    set: (v: T) => value.set(v),
  } as {
    value: WritableSignal<T>;
    trigger: () => void;
    read: () => T;
    set: (v: T) => void;
  };
}
