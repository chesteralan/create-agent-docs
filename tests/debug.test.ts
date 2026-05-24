import { describe, test, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('debug utilities', () => {
  test('setVerbose enables verbose logging', async () => {
    const { setVerbose, debugLog } = await import('../src/utils/debug.js');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    debugLog('should not appear');
    expect(logSpy).not.toHaveBeenCalled();

    setVerbose(true);
    debugLog('should appear');
    expect(logSpy).toHaveBeenCalledWith('[verbose]', 'should appear');
    logSpy.mockRestore();
  });

  test('setDebug enables debug error logging', async () => {
    const { setDebug, debugError } = await import('../src/utils/debug.js');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    debugError('hidden');
    expect(errorSpy).not.toHaveBeenCalled();

    setDebug(true);
    debugError('visible');
    expect(errorSpy).toHaveBeenCalledWith('[debug]', 'visible');
    errorSpy.mockRestore();
  });

  test('setDebug implies setVerbose', async () => {
    const { setDebug, debugLog } = await import('../src/utils/debug.js');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    setDebug(true);
    debugLog('verbose from debug');
    expect(logSpy).toHaveBeenCalledWith('[verbose]', 'verbose from debug');
    logSpy.mockRestore();
  });

  test('debugLog produces no output by default', async () => {
    const { debugLog } = await import('../src/utils/debug.js');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    debugLog('silent');
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  test('debugError produces no output without debug mode', async () => {
    const { debugError } = await import('../src/utils/debug.js');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    debugError('silent');
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
