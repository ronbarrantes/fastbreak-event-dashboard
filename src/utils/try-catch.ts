type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps an async operation and returns a `Result` object instead of throwing.
 *
 * This is useful for avoiding try/catch blocks when working with async functions.
 *
 * @template T The type of the resolved value.
 * @template E The type of the expected error, defaults to `Error`.
 *
 * @param promise - A promise to execute.
 * @returns A promise that resolves to a `Result` object with either data or error.
 *
 * @example
 * const result = await tryCatch(fetch("/api"));
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data);
 * }
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
