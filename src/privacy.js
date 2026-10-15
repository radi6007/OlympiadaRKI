import documentText from './content/participant-data.md?raw';

export const privacyLabels = {
  ru: 'Обработка данных участников олимпиады',
  en: 'Olympiad participant data processing (RU)',
};
export function privacyLink(lang = 'ru') {
  return `<a class="privacy-link" href="/data-processing" target="_blank" rel="noopener noreferrer">${privacyLabels[lang] || privacyLabels.ru}</a>`;
}
const escape = text => text.replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
}[character]));

// The supplied document contains headings and paragraphs only. Escape its text
// instead of interpreting raw HTML; keep every paragraph and its wording intact.
export function privacyDocument() {
  return documentText.trim().split(/\r?\n\s*\r?\n/).map(block => {
    const heading = /^(#{1,2}) (.+)$/.exec(block);
    const tag = heading ? `h${heading[1].length}` : 'p';
    let text = escape(heading ? heading[2] : block);
    text = text.replace('https://www.ros-edu.ru/legal-information', '<a href="https://www.ros-edu.ru/legal-information" target="_blank" rel="noopener noreferrer">https://www.ros-edu.ru/legal-information</a>');
    return `<${tag}>${text}</${tag}>`;
  }).join('\n');
}
