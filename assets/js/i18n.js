/* Simple i18n loader using JSON locale files and data-i18n attributes.
   Saves chosen language in localStorage.
*/
const defaultLang = 'en';
const supported = ['en','ru','kz'];

async function loadLocale(lang){
  if(!supported.includes(lang)) lang = defaultLang;
  try{
    const res = await fetch(`locales/${lang}.json`);
    if(!res.ok) throw new Error('Locale not found');
    return await res.json();
  }catch(e){
    if(lang !== defaultLang) return loadLocale(defaultLang);
    return {};
  }
}

function applyLocale(locale){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const text = locale[key];
    if(!text) return;
    if(el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea'){
      el.placeholder = text;
    } else {
      el.innerHTML = text;
    }
  });
}

async function setLanguage(lang){
  const locale = await loadLocale(lang);
  applyLocale(locale);
  localStorage.setItem('site-lang', lang);
  // set selects
  document.querySelectorAll('#lang-select').forEach(sel=>{
    sel.value = lang;
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('site-lang') || navigator.language.slice(0,2) || defaultLang;
  const lang = supported.includes(saved) ? saved : defaultLang;
  setLanguage(lang);

  document.querySelectorAll('#lang-select').forEach(sel=>{
    sel.value = lang;
    sel.addEventListener('change', (e)=>{
      setLanguage(e.target.value);
    });
  });
});
