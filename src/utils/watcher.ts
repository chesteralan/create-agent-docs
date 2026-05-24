import fs from 'fs';

export function createWatcher(
  watchDir: string,
  onChange: (event: string, file: string) => void,
): fs.FSWatcher {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const handler: fs.WatchListener<string> = (event, filename) => {
    if (filename && filename.endsWith('.hbs')) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(event, filename);
      }, 300);
    }
  };

  return fs.watch(watchDir, { recursive: true }, handler);
}
