import EventEmitter from "events";

// I should have probably disabled linter errors...
type AsyncGeneratorFunc<T> = (
  ...args: any[]
) => AsyncGenerator<T, void, unknown>;

export const withEmitEvents =
  <T, U>(
    asyncGeneratorFunc: AsyncGeneratorFunc<T>,
    emitter: EventEmitter,
    eventName: string,
    endingEvent?: string
  ) =>
  async (...args: U[]) => {
    for await (const result of asyncGeneratorFunc(...args)) {
      emitter.emit(eventName, result);
    }

    if (endingEvent) {
      emitter.emit(endingEvent);
    }
  };
