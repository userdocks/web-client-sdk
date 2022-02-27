export const splittedLocationPathname = () => {
  return window.location.pathname
    .split('/')
    .filter((item: string) => item !== '');
};

export const hasLanguage = () => {
  const split = splittedLocationPathname();
  return Array.isArray(split) && split.length > 0
    ? split[0] === 'en' || split[0] === 'de'
    : false;
};

const lang = () => {
  const split = splittedLocationPathname();
  const hasLang = hasLanguage();

  return hasLang
    ? split[0]
    : localStorage.getItem('language') ||
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        'en';
};

const language = () => {
  const l = lang();
  return l.includes('-') ? l.split('-')[0] : l;
};

export default language;
