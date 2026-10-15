/* Solid UI symbols matching the filled style in the supplied RKI reference.
   Paths are code-native assets; shared by information pages and the test. */
const paths = {
  singleChoice: 'M6 2a5 5 0 1 0 0 10A5 5 0 0 0 6 2Zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm8 1h9v2h-9V6ZM6 14a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm8 2h9v2h-9v-2Z',
  multipleChoice: 'M1 2h10v9H1V2Zm2 4 3 3 4-5-1.5-1L6 6.5 4.5 5 3 6Zm11 0h9v2h-9V6ZM1 14h10v9H1v-9Zm2 4 3 3 4-5-1.5-1L6 18.5 4.5 17 3 18Zm11 0h9v2h-9v-2Z',
  matching: 'm16 2 7 6-7 6v-4H2V6h14V2ZM8 10v4h14v4H8v4l-7-6 7-6Z',
  medal: 'M5 2h5l2 5 2-5h5l-4 7a7 7 0 1 1-6 0L5 2Zm7 9-1.2 2.5-2.8.4 2 2-.5 2.8 2.5-1.3 2.5 1.3-.5-2.8 2-2-2.8-.4L12 11Z',
  cert: 'M4 3a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9v-3H5V6h14v6h3V5a2 2 0 0 0-2-2H4Zm3 5v2h10V8H7Zm0 4v2h6v-2H7Zm11 1a4 4 0 0 0-3 6.6V23l3-1.5 3 1.5v-3.4A4 4 0 0 0 18 13Z',
  mail: 'M3 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3Zm0 3V6l9 6 9-6v1l-9 6-9-6Z',
  headphones: 'M12 2A10 10 0 0 0 2 12v7a3 3 0 0 0 3 3h2a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5a7 7 0 0 1 14 0h-2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a3 3 0 0 0 3-3v-7A10 10 0 0 0 12 2Z',
  chat: 'M4 2a3 3 0 0 0-3 3v17l5-5h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H4Zm2 5h12v2H6V7Zm0 4h9v2H6v-2Z',
  keyboard: 'M3 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3Zm1 3h2v2H4V7Zm4 0h2v2H8V7Zm4 0h2v2h-2V7Zm4 0h2v2h-2V7Zm4 0h1v2h-1V7ZM4 11h2v2H4v-2Zm4 0h2v2H8v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h1v2h-1v-2ZM6 15h12v2H6v-2Z',
  info: 'M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm-1 5h2v2h-2V6Zm0 4h2v8h-2v-8Z',
  time: 'M9 1h6v3H9V1Zm3 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1 3h2v6h-2V8Zm8-5 3 3-2 2-3-3 2-2Z',
  check: 'm9 16.2-4.2-4.2L2 14.8 9 22 23 6.8 20.2 4 9 16.2Z',
  right: 'm14 3-2 2 5 5H2v4h15l-5 5 2 2 10-9L14 3Z',
  left: 'm10 3 2 2-5 5h15v4H7l5 5-2 2-10-9 10-9Z',
  external: 'M7 3v3h9L3 19l2 2L18 8v9h3V3H7Z',
  play: 'M6 3v18l16-9L6 3Z',
};
export function icon(name) {
  return `<svg class="rki-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="${paths[name] || paths.info}"/></svg>`;
}
export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
}
