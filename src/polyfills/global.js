// Polyfill for Node.js global in browser
if (typeof global === "undefined") {
  // @ts-expect-error
  window.global = window;
}

// Polyfill for Node.js Buffer in browser
import { Buffer } from 'buffer';
if (typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}
