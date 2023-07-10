import EventEmitter from "events";

// I should have probably disabled linter errors...
type AsyncGeneratorFunc<T> = (
  ...args: any[]
) => AsyncGenerator<T, void, unknown>;

export const withEmitEvents =
  <T>(
    asyncGeneratorFunc: AsyncGeneratorFunc<T>,
    emitter: EventEmitter,
    eventName: string,
    endingEvent?: string
  ) =>
  async (...args: any[]) => {
    for await (const result of asyncGeneratorFunc(...args)) {
      emitter.emit(eventName, result);
    }

    if (endingEvent) {
      emitter.emit(endingEvent);
    }
  };

export const withTiming =
  <T>(func: (...args: any[]) => Promise<T>) =>
  async (...args: any[]): Promise<number> => {
    const startTime = Date.now();
    await func(...args);
    const endTime = Date.now();

    return (endTime - startTime) / 1000;
  };
