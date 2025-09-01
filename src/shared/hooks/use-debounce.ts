export function useDebounce<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeout: number = 300
): (...args: Params) => void {
  let timer: NodeJS.Timeout;

  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
