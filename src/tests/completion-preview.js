import '../fonts.css';
import '../design-tokens.css';
import { mountIcons } from '../icons.js';
import { privacyLabels } from '../privacy.js';
import './test.css';
import './shared.css';
import { applyDemoCopy } from './demo.js';

// Standalone visual preview: never loads or changes the participant's attempt.
const copy = {
  ru: {
    doneT: 'Спасибо за участие!',
    footer: 'Международная олимпиада «Русский язык: код единства» · ЧГПУ · Платформа РКИ IPR',
    level: 'РКИ-1 · уровень А1+/А2',
  },
  en: {
    doneT: 'Thank you for taking part!',
    footer: 'International Olympiad “Russian: the Code of Unity” · ChSPU · IPR RFL Platform',
    level: 'РКИ-1 · level A1+/A2',
  },
};
applyDemoCopy(copy);
mountIcons();
function render(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('.privacy-link').forEach(el => { el.textContent = privacyLabels[lang]; });
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = copy[lang][el.dataset.i18n] || '';
  });
  document.getElementById('chipLvl').textContent = copy[lang].level;
  for (const [code, id] of [['ru', 'langRu'], ['en', 'langEn']]) {
    const button = document.getElementById(id);
    button.setAttribute('aria-pressed', code === lang);
    button.onclick = () => render(code);
  }
}
render(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ru');
