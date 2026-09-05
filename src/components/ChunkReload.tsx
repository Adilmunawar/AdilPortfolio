'use client';
import { useEffect } from 'react';

const KEY = 'chunk-reload-at';

function isChunkError(err: unknown) {
  const e = err as { name?: string; message?: string } | undefined;
  return e?.name === 'ChunkLoadError' || /Loading chunk \d+ failed|Loading CSS chunk/.test(e?.message ?? '');
}

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last < 30_000) return;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {}
  window.location.reload();
}

export default function ChunkReload() {
  useEffect(() => {
    const onRejection = (ev: PromiseRejectionEvent) => {
      if (isChunkError(ev.reason)) {
        ev.preventDefault();
        reloadOnce();
      }
    };
    const onError = (ev: ErrorEvent) => {
      if (isChunkError(ev.error)) reloadOnce();
    };
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError);
    };
  }, []);
  return null;
}
