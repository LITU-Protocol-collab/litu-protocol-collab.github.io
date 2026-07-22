const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a') && !event.target.closest('.language-picker')) {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

// 手機瀏覽器對頁內錨點的處理不一致，明確將「返回頂端」捲動至頁首。
document.querySelector('.back-to-top')?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  window.history.replaceState(null, '', '#top');
});

// 沿用原網站的 Google 多國語言功能：繁中、簡中、英、日、韓、西、法。
window.googleTranslateElementInit = function googleTranslateElementInit() {
  new window.google.translate.TranslateElement({
    pageLanguage: 'zh-TW',
    includedLanguages: 'zh-TW,zh-CN,en,ja,ko,es,fr',
    autoDisplay: false,
  }, 'google_translate_element');
};

function translatePage(languageCode) {
  const googleSelector = document.querySelector('.goog-te-combo');
  if (!googleSelector) return false;
  googleSelector.value = languageCode;
  googleSelector.dispatchEvent(new Event('change'));
  return true;
}

const languageSelector = document.querySelector('#langSelect');
languageSelector?.addEventListener('change', (event) => {
  if (!translatePage(event.target.value)) {
    window.setTimeout(() => translatePage(event.target.value), 700);
  }
});

window.addEventListener('load', () => {
  const systemLanguage = navigator.language || 'zh-TW';
  const supportedLanguage = ['zh-CN', 'en', 'ja', 'ko', 'es', 'fr'].find((code) => systemLanguage.startsWith(code));
  if (!supportedLanguage) return;
  languageSelector.value = supportedLanguage;
  window.setTimeout(() => translatePage(supportedLanguage), 900);
});

const toast = document.querySelector('.toast');

document.querySelectorAll('.copy-address').forEach((copyButton) => {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
      toast.textContent = '地址已複製';
      toast.classList.add('show');
      window.setTimeout(() => toast.classList.remove('show'), 1800);
    } catch {
      window.prompt('請複製以下地址：', copyButton.dataset.copy);
    }
  });
});

// 素材防護：阻擋圖片拖曳與圖片／影片右鍵選單。
document.addEventListener('dragstart', (event) => {
  if (event.target.closest('img, video')) event.preventDefault();
});

document.addEventListener('contextmenu', (event) => {
  if (event.target.closest('img, video')) event.preventDefault();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.agent-card, .timeline li, .aureum-grid article, .document-grid a').forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});
