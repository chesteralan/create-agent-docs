export let isVerbose = false;
export let isDebug = false;

export function setVerbose(v: boolean): void {
  isVerbose = v;
}

export function setDebug(d: boolean): void {
  isDebug = d;
  if (d) isVerbose = true;
}

export function debugLog(...args: unknown[]): void {
  if (isVerbose) {
    console.log('[verbose]', ...args);
  }
}

export function debugError(...args: unknown[]): void {
  if (isDebug) {
    console.error('[debug]', ...args);
  }
}
