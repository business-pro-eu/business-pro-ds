(() => {
  const storageKey = 'bp-theme';
  const preferenceStorageKey = 'bp-theme-preference';
  const root = document.documentElement;
  const systemPreference = window.matchMedia?.('(prefers-color-scheme: dark)') || null;

  function storedTheme() {
    try {
      const pref = localStorage.getItem(preferenceStorageKey);
      if (pref === 'dark' || pref === 'light') return pref;
      if (pref === 'system') return null;
      const legacy = localStorage.getItem(storageKey);
      return legacy === 'dark' || legacy === 'light' ? legacy : null;
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

  // A platform with a single look keeps it: <html data-bp-theme-lock="dark|light"> ignores the system and the saved choice.
  const lockedTheme = () => (root.dataset.bpThemeLock === 'dark' || root.dataset.bpThemeLock === 'light' ? root.dataset.bpThemeLock : null);

  function syncTheme(notify = true) {
    if (lockedTheme()) {
      applyTheme(lockedTheme(), 'locked', notify);
      return;
    }
    const saved = storedTheme();
    applyTheme(saved || systemTheme(), saved ? 'manual' : 'system', notify);
  }

  // Saved on the signed-in user: the page names the endpoint (and CSRF token) on <html>:
  // data-bp-theme-endpoint, data-bp-theme-csrf, data-bp-theme-csrf-header (default X-CSRF-Token).
  // The server's choice for the user (data-bp-theme-user = light | dark | system) wins over this browser's.
  function persistPreference(pref) {
    const endpoint = root.dataset.bpThemeEndpoint;
    if (!endpoint || !window.fetch) return;
    const headers = { 'Content-Type': 'application/json' };
    if (root.dataset.bpThemeCsrf) headers[root.dataset.bpThemeCsrfHeader || 'X-CSRF-Token'] = root.dataset.bpThemeCsrf;
    try {
      fetch(endpoint, { method: 'POST', headers, credentials: 'same-origin', keepalive: true, body: JSON.stringify({ theme: pref }) }).catch(() => {});
    } catch (error) {
      // The choice still applies in this browser.
    }
  }

  function setTheme(theme) {
    if (lockedTheme()) return;
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(preferenceStorageKey, nextTheme);
      localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
      // Tema rămâne activă în sesiunea curentă chiar dacă stocarea nu este disponibilă.
    }
    applyTheme(nextTheme, 'manual');
    persistPreference(nextTheme);
  }

  function useSystemTheme() {
    if (lockedTheme()) return;
    try {
      localStorage.setItem(preferenceStorageKey, 'system');
      localStorage.removeItem(storageKey);
    } catch (error) {
      // Sincronizarea cu sistemul funcționează în continuare în sesiunea curentă.
    }
    applyTheme(systemTheme(), 'system');
    persistPreference('system');
  }

  systemPreference?.addEventListener?.('change', () => {
    if (!lockedTheme() && !storedTheme()) applyTheme(systemTheme(), 'system');
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

  // The user's saved choice comes first (it follows them across devices); without one, this browser's choice is kept
  // and, when it is a manual one, saved on the user once.
  const userPref = root.dataset.bpThemeUser;
  if (userPref === 'dark' || userPref === 'light' || userPref === 'system') {
    try {
      localStorage.setItem(preferenceStorageKey, userPref);
      if (userPref === 'system') localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, userPref);
    } catch (error) {
      // Applied for this page anyway.
    }
  } else if (root.dataset.bpThemeEndpoint && storedTheme()) {
    persistPreference(storedTheme());
  }
  syncTheme(false);
})();
