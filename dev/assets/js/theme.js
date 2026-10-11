(() => {
  const storageKey = 'bp-theme';
  const preferenceStorageKey = 'bp-theme-preference';
  const root = document.documentElement;
  const systemPreference = window.matchMedia?.('(prefers-color-scheme: dark)') || null;

  function storedTheme() {
    try {
      const value = localStorage.getItem(preferenceStorageKey);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function systemTheme() {
    return systemPreference?.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, source, notify = true) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const changed = root.dataset.bpTheme !== nextTheme || root.dataset.bpThemeSource !== source;
    root.dataset.bpTheme = nextTheme;
    root.dataset.bpThemeSource = source;
    if (changed && notify) {
      window.dispatchEvent(new CustomEvent('bp:themechange', {
        detail: { theme: nextTheme, source },
      }));
    }
  }

  function syncTheme(notify = true) {
    const saved = storedTheme();
    applyTheme(saved || systemTheme(), saved ? 'manual' : 'system', notify);
  }

  function setTheme(theme) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(preferenceStorageKey, nextTheme);
      localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
      // Tema rămâne activă în sesiunea curentă chiar dacă stocarea nu este disponibilă.
    }
    applyTheme(nextTheme, 'manual');
  }

  function useSystemTheme() {
    try {
      localStorage.setItem(preferenceStorageKey, 'system');
      localStorage.removeItem(storageKey);
    } catch (error) {
      // Sincronizarea cu sistemul funcționează în continuare în sesiunea curentă.
    }
    applyTheme(systemTheme(), 'system');
  }

  systemPreference?.addEventListener?.('change', () => {
    if (!storedTheme()) applyTheme(systemTheme(), 'system');
  });

  window.addEventListener('storage', (event) => {
    if (event.key === preferenceStorageKey) syncTheme();
  });

  window.BPTheme = {
    get preference() { return storedTheme() || 'system'; },
    get resolved() { return root.dataset.bpTheme === 'dark' ? 'dark' : 'light'; },
    set: setTheme,
    useSystem: useSystemTheme,
    sync: syncTheme,
  };

  syncTheme(false);
})();
