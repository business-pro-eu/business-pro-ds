(() => {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let activeDialog = null;
  let activeTrigger = null;
  let mobileFilterSheet = null;
  let mobileFilterSources = [];
  const themeStorageKey = 'bp-theme';

  function bpIcon(...names) {
    const icon = document.createElement('i');
    icon.classList.add('bp-icon', ...names);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function textElement(tagName, className, text = '') {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function selectMenuFor(control) {
    return control?._bpSelectMenu || control?.querySelector('.bp-select-control__menu') || null;
  }

  function restoreSelectMenu(control) {
    const menu = selectMenuFor(control);
    if (!control || !menu) return;
    if (menu.parentElement !== control) control.appendChild(menu);
    menu.classList.remove('bp-select-control__menu--portal', 'is-opening-up');
    menu.removeAttribute('style');
  }

  function closeSelectControl(control) {
    const menu = selectMenuFor(control);
    if (menu) menu.hidden = true;
    control?.querySelector('.bp-select-control__trigger')?.setAttribute('aria-expanded', 'false');
    restoreSelectMenu(control);
  }

  function positionSelectMenu(control) {
    const trigger = control?.querySelector('.bp-select-control__trigger');
    const menu = selectMenuFor(control);
    if (!trigger || !menu || menu.hidden) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const rootStyles = getComputedStyle(document.documentElement);
    const cssGutter = Number.parseFloat(rootStyles.getPropertyValue('--bp-page-gutter'));
    const gutter = Number.isFinite(cssGutter) && cssGutter > 0 ? cssGutter : 8;
    const gap = 4;
    const below = Math.max(0, viewportHeight - rect.bottom - gap - gutter);
    const above = Math.max(0, rect.top - gap - gutter);
    const openUp = below < 180 && above > below;
    const width = Math.min(rect.width, viewportWidth - gutter * 2);
    const left = Math.min(Math.max(gutter, rect.left), Math.max(gutter, viewportWidth - width - gutter));

    menu.classList.add('bp-select-control__menu--portal');
    menu.classList.toggle('is-opening-up', openUp);
    Object.assign(menu.style, {
      position: 'fixed',
      right: 'auto',
      left: `${left}px`,
      width: `${width}px`,
      maxHeight: `${Math.max(96, openUp ? above : below)}px`,
      top: openUp ? 'auto' : `${rect.bottom + gap}px`,
      bottom: openUp ? `${viewportHeight - rect.top + gap}px` : 'auto',
    });
  }

  function openSelectControl(control) {
    const menu = selectMenuFor(control);
    const trigger = control?.querySelector('.bp-select-control__trigger');
    if (!control || !menu || !trigger) return;
    closeAllDropdowns(control);
    // Apply fixed positioning before the menu becomes visible so it never
    // joins the body flow layout: a transient in-flow menu can toggle the
    // page scrollbar, firing a visualViewport resize that instantly closes it.
    menu.classList.add('bp-select-control__menu--portal');
    menu.style.position = 'fixed';
    menu.hidden = false;
    document.body.appendChild(menu);
    trigger.setAttribute('aria-expanded', 'true');
    positionSelectMenu(control);
    menu.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true });
  }

  function resolvedTheme() {
    if (document.documentElement.dataset.bpTheme === 'dark') return 'dark';
    if (document.documentElement.dataset.bpTheme === 'light') return 'light';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeLogos() {
    const theme = resolvedTheme();
    document.querySelectorAll('img[data-bp-logo-light][data-bp-logo-dark]').forEach((logo) => {
      const nextSrc = theme === 'dark' ? logo.dataset.bpLogoDark : logo.dataset.bpLogoLight;
      if (nextSrc && logo.getAttribute('src') !== nextSrc) {
        logo.setAttribute('src', nextSrc);
      }
    });
  }

  function syncThemeToggles() {
    const theme = resolvedTheme();
    syncThemeLogos();
    document.querySelectorAll('[data-bp-theme-toggle]').forEach((button) => {
      const nextLabel = theme === 'dark' ? 'Activeaza tema luminoasa' : 'Activeaza tema intunecata';
      button.setAttribute('aria-label', nextLabel);
      button.setAttribute('title', nextLabel);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      const icon = button.querySelector('.bp-icon');
      icon?.classList.toggle('fa-sun', theme === 'dark');
      icon?.classList.toggle('fa-moon', theme !== 'dark');
    });
  }

  function setTheme(theme) {
    if (window.BPTheme?.set) {
      window.BPTheme.set(theme);
    } else {
      document.documentElement.dataset.bpTheme = theme;
      try {
        localStorage.setItem(themeStorageKey, theme);
      } catch (error) {
        // The selected theme still applies for the current page.
      }
    }
    syncThemeToggles();
  }

  window.addEventListener('bp:themechange', syncThemeToggles);

  function closeSelectControls(except = null) {
    document.querySelectorAll('.bp-select-control').forEach((control) => {
      if (control === except) return;
      closeSelectControl(control);
    });
  }

  function closeComboboxes(except = null) {
    document.querySelectorAll('.bp-combobox').forEach((control) => {
      if (control === except) return;
      control.querySelector('.bp-combobox__menu')?.setAttribute('hidden', '');
      control.querySelector('.bp-combobox__toggle')?.setAttribute('aria-expanded', 'false');
    });
  }

  function closeLegacyDropdowns(except = null) {
    document.querySelectorAll('.bp-filter-dropdown__menu.is-open, .bp-menu-toggle-state.is-open').forEach((menu) => {
      if (menu === except || menu.contains(except)) return;
      menu.classList.remove('is-open');
      menu.hidden = true;
      document.querySelectorAll(`[data-bp-menu-toggle="#${menu.id}"], [aria-controls="${menu.id}"]`).forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.querySelectorAll('.bp-nav-dropdown.is-open').forEach((root) => {
      const menu = root.querySelector('.nav-dropdown-menu');
      if (root === except || menu === except || root.contains(except)) return;
      root.classList.remove('is-open');
      root.querySelector('[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
    });
  }

  function closeAllDropdowns(except = null) {
    closeSelectControls(except?.closest?.('.bp-select-control') || null);
    closeComboboxes(except?.closest?.('.bp-combobox') || null);
    closeFloatingMenus(except?.matches?.('[data-bp-floating-menu]') ? except : null);
    closeLegacyDropdowns(except);
  }

  function eventTargetInsideSelect(event) {
    const target = event?.target;
    return !!target?.closest?.('.bp-select-control, .bp-select-control__menu--portal');
  }

  function visibleDropdownTrigger(menu) {
    if (!menu) return null;
    if (menu.id) {
      const attrId = menu.id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const matches = [...document.querySelectorAll(`[data-bp-menu-toggle="#${attrId}"], [aria-controls="${attrId}"]`)];
      // A table row and its responsive card both carry the trigger: anchor to the one on screen.
      const explicit = matches.find((el) => el.getClientRects().length) || matches[0];
      if (explicit) return explicit;
    }
    return menu.closest('.bp-overflow, .bp-filter-dropdown, .nav-dropdown, .bp-select-control, .bp-combobox')?.querySelector('button, [role="button"], .nav-link, a, input') || menu.parentElement;
  }

  // Menus opened inside the mobile filter sheet are moved to <body> while open: the sheet clips its content
  // (overflow + rounded corners), which would cut the menu. They go back to their place when closed.
  const PORTAL_RESET_PROPERTIES = ['left', 'top', 'right', 'bottom', 'maxHeight', 'maxWidth', 'overflowY'];

  function portalMenu(menu, trigger = null) {
    if (menu._bpHome) return;
    let target = null;
    if (menu.closest?.('.bp-filter-sheet__body')) {
      target = document.body;
    } else if (
      menu.closest?.('.bp-table-shell--responsive') && !menu.getClientRects().length
      && trigger?.isConnected && trigger.getClientRects().length
    ) {
      // The menu lives in a table that is hidden on small screens (shown as cards): open it inside the
      // visible card, next to the trigger, so it stays within the same click handlers.
      target = trigger.closest('.bp-overflow') || trigger.parentElement;
    }
    if (!target) return;
    const table = menu.closest('table[data-bp-responsive-cards]');
    menu._bpHome = { parent: menu.parentNode, next: menu.nextSibling, table };
    menu.classList.add('bp-menu-portal');
    target.appendChild(menu);
    discardTableMutations(table);
  }

  // Moving a menu in or out of a card-enabled table is not a data change: drop the queued mutation so the
  // cards are not rebuilt (which would destroy the card the menu was just opened in).
  function discardTableMutations(table) {
    if (table && typeof responsiveTableObservers !== 'undefined') responsiveTableObservers.get(table)?.takeRecords();
  }

  function unportalMenu(menu) {
    const home = menu._bpHome;
    if (!home) return;
    delete menu._bpHome;
    menu.classList.remove('bp-menu-portal');
    PORTAL_RESET_PROPERTIES.forEach((property) => menu.style.removeProperty(property));
    home.parent.insertBefore(menu, home.next && home.next.parentNode === home.parent ? home.next : null);
    discardTableMutations(home.table);
  }

  function unportalAllMenus() {
    document.querySelectorAll('.bp-menu-portal').forEach(unportalMenu);
  }

  function positionDropdownInViewport(menu, trigger = visibleDropdownTrigger(menu)) {
    if (!menu || !trigger || !menu.isConnected) return;
    portalMenu(menu, trigger);
    const isHidden = menu.hidden || getComputedStyle(menu).display === 'none' || getComputedStyle(menu).visibility === 'hidden';
    if (isHidden) return;
    syncFilterMenuSearchVisibility(menu);

    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const rootStyles = getComputedStyle(document.documentElement);
    const cssGutter = Number.parseFloat(rootStyles.getPropertyValue('--bp-page-gutter'));
    const gutter = Number.isFinite(cssGutter) && cssGutter > 0 ? cssGutter : 8;
    const gap = 6;
    const isFixed = menu.hasAttribute('data-bp-floating-menu') || getComputedStyle(menu).position === 'fixed';
    const offsetParent = isFixed ? null : (menu.offsetParent || menu.parentElement || document.body);
    const parentRect = isFixed ? { left: 0, top: 0, bottom: viewportHeight } : offsetParent.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const isFilterMenu = menu.classList.contains('bp-filter-menu');
    const maxMenuWidth = Math.min(viewportWidth - gutter * 2, isFilterMenu ? 400 : viewportWidth - gutter * 2);

    ['right', 'left', 'top', 'bottom', 'maxHeight', 'overflowY'].forEach((property) => {
      menu.style.removeProperty(property);
    });
    menu.style.removeProperty('maxWidth');

    let rect = menu.getBoundingClientRect();
    const menuWidth = Math.min(rect.width || menu.offsetWidth || 260, maxMenuWidth);
    const alignStart = menu.dataset.bpMenuAlign === 'start'
      || menu.classList.contains('bp-overflow__menu--start')
      || menu.classList.contains('bp-filter-dropdown__menu')
      || menu.classList.contains('bp-filter-menu')
      || (menu.classList.contains('bp-overflow__menu--actions')
        && menu.dataset.bpMenuAlign !== 'end'
        && (triggerRect.left + (triggerRect.width / 2)) < (viewportWidth / 2));
    const idealLeft = alignStart ? triggerRect.left : triggerRect.right - menuWidth;
    const leftInViewport = Math.min(
      Math.max(gutter, idealLeft),
      Math.max(gutter, viewportWidth - menuWidth - gutter)
    );
    const below = Math.max(0, viewportHeight - triggerRect.bottom - gap - gutter);
    const above = Math.max(0, triggerRect.top - gap - gutter);
    const openUp = rect.height > below && above > below;
    // Ten menu rows (10 × 40px), plus the menu/list padding, fit without a scrollbar.
    const filterMenuMaxHeight = 416;
    const maxHeight = Math.max(96, Math.min(openUp ? above : below, viewportHeight - gutter * 2, isFilterMenu ? filterMenuMaxHeight : viewportHeight - gutter * 2));

    Object.assign(menu.style, {
      left: `${Math.round(leftInViewport - parentRect.left)}px`,
      right: 'auto',
      top: openUp ? 'auto' : `${Math.round(triggerRect.bottom + gap - parentRect.top)}px`,
      bottom: openUp ? `${Math.round(parentRect.bottom - triggerRect.top + gap)}px` : 'auto',
      maxHeight: `${Math.round(maxHeight)}px`,
      maxWidth: `${Math.round(maxMenuWidth)}px`,
      overflowY: isFilterMenu ? 'hidden' : 'auto',
    });
  }

  function positionOpenDropdowns() {
    document.querySelectorAll('[data-bp-floating-menu]:not([hidden]), .bp-filter-dropdown__menu.is-open, .bp-menu-toggle-state.is-open, .bp-nav-dropdown.is-open > .bp-nav-dropdown__menu').forEach((menu) => {
      positionDropdownInViewport(menu);
    });
  }

  function menuForFilterTrigger(trigger) {
    const selector = trigger?.dataset?.bpMenuToggle || '';
    if (selector) return document.querySelector(selector);
    const controls = trigger?.getAttribute?.('aria-controls') || '';
    return controls ? document.getElementById(controls) : null;
  }

  function filterMenuItems(menu) {
    if (!menu) return [];
    const items = [
      ...menu.querySelectorAll('.bp-dropdown-list > button, .bp-dropdown-list > a, .bp-filter-dropdown__list > button, .bp-filter-dropdown__list > a, :scope > .bp-overflow__item, :scope > button, :scope > a')
    ].filter((item) => !item.closest('.bp-dropdown-search, .bp-filter-dropdown__search'));
    return [...new Set(items)];
  }

  function ensureFilterMenuSearch(menu) {
    if (!menu) return;
    if (menu.matches?.('.bp-overflow__menu--actions') || menu.dataset.bpNoSearch === '1') {
      menu.querySelector('.bp-dropdown-search, .bp-filter-dropdown__search')?.remove();
      menu.dataset.bpFilterSearchEnhanced = '0';
      return;
    }
    if (menu.dataset.bpFilterSearchEnhanced === '1') return;
    const existingSearch = menu.querySelector('.bp-dropdown-search input, .bp-filter-dropdown__search input');
    const items = filterMenuItems(menu);
    if (existingSearch || items.length <= 6) {
      menu.dataset.bpFilterSearchEnhanced = existingSearch ? '1' : '0';
      return;
    }

    const searchWrap = document.createElement('div');
    searchWrap.className = 'bp-dropdown-search';
    const searchInput = document.createElement('input');
    searchInput.className = 'bp-input';
    searchInput.type = 'search';
    searchInput.dataset.bpFilterMenuSearch = '';
    searchInput.placeholder = 'Search...';
    searchInput.autocomplete = 'off';
    searchWrap.appendChild(searchInput);
    menu.prepend(searchWrap);
    menu.dataset.bpFilterSearchEnhanced = '1';
  }

  function syncFilterMenuSearchVisibility(menu) {
    if (!menu?.classList?.contains('bp-filter-menu')) return;
    const searchWrap = menu.querySelector('.bp-dropdown-search, .bp-filter-dropdown__search');
    const scrollArea = menu.querySelector('.bp-dropdown-list, .bp-filter-dropdown__list') || menu;
    if (!searchWrap || !scrollArea) {
      menu.classList.remove('bp-filter-menu--search-visible', 'bp-filter-menu--scrollable');
      return;
    }

    menu.classList.remove('bp-filter-menu--search-visible', 'bp-filter-menu--scrollable');
    const needsScroll = scrollArea.scrollHeight > 416;
    menu.classList.toggle('bp-filter-menu--search-visible', needsScroll);
    menu.classList.toggle('bp-filter-menu--scrollable', needsScroll);
  }

  function enhanceFilterMenu(menu) {
    if (!menu?.matches?.('.bp-filter-dropdown__menu, [data-bp-floating-menu], .bp-overflow__menu')) return;
    // Long grouped menus (compact) are plain action menus: no filter search, and no 416px cap.
    if (menu.matches('.bp-overflow__menu--compact')) return;
    menu.classList.add('bp-filter-menu');
    ensureFilterMenuSearch(menu);
    syncFilterMenuSearchVisibility(menu);
  }

  function enhanceFilterDropdowns(root = document) {
    const candidates = [];
    if (root.matches?.('.bp-data-toolbar button, [data-bp-mobile-filter-source] button, .bp-toolbar-row button, [data-bp-filter-region] button')) {
      candidates.push(root);
    }
    root.querySelectorAll?.('.bp-data-toolbar button, [data-bp-mobile-filter-source] button, .bp-toolbar-row button, [data-bp-filter-region] button').forEach((button) => candidates.push(button));

    candidates.forEach((trigger) => {
      if (trigger.matches('.bp-mobile-filter-trigger, .bp-icon-button, [data-bp-dialog-open], [data-bp-theme-toggle]')) return;
      const menu = menuForFilterTrigger(trigger);
      if (!menu) {
        if (trigger.hasAttribute('aria-pressed')) {
          trigger.classList.add('bp-button', 'bp-button--sm', 'bp-filter-trigger');
        }
        return;
      }
      trigger.classList.add('bp-button', 'bp-button--sm', 'bp-filter-trigger');
      enhanceFilterMenu(menu);
    });

    const menu = root.matches?.('.bp-filter-menu, .bp-filter-dropdown__menu, [data-bp-floating-menu], .bp-overflow__menu') ? root : root.closest?.('.bp-filter-menu');
    if (menu?.classList?.contains('bp-filter-menu')) {
      delete menu.dataset.bpFilterSearchEnhanced;
      ensureFilterMenuSearch(menu);
      syncFilterMenuSearchVisibility(menu);
    }
  }

  function comboboxValues(input) {
    const listId = input?.dataset.bpComboboxList || '';
    const list = listId ? document.getElementById(listId) : null;
    if (!list) return [];
    return [...list.options]
      .map((option) => String(option.value || option.textContent || '').trim())
      .filter((value, index, values) => value && values.indexOf(value) === index);
  }

  function renderCombobox(input) {
    const control = input?.closest('.bp-combobox');
    const menu = control?.querySelector('.bp-combobox__menu');
    if (!menu) return;
    const query = String(input.value || '').trim().toLocaleLowerCase();
    const values = comboboxValues(input).filter((value) => !query || value.toLocaleLowerCase().includes(query));
    if (!values.length) {
      menu.replaceChildren(textElement('span', 'bp-combobox__empty', 'Nu exista optiuni. Poti introduce o valoare noua.'));
      return;
    }
    menu.replaceChildren(...values.map((value) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'bp-combobox__option';
      option.dataset.value = value;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(value === input.value));
      option.textContent = value;
      return option;
    }));
  }

  function enhanceCombobox(input) {
    if (!input?.matches?.('input.bp-input[list]') || input.parentElement?.classList.contains('bp-combobox')) {
      return;
    }
    const listId = input.getAttribute('list');
    if (!listId) return;
    input.dataset.bpComboboxList = listId;
    input.removeAttribute('list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');

    const wrapper = document.createElement('span');
    wrapper.className = 'bp-combobox';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'bp-icon-button bp-combobox__toggle';
    toggle.setAttribute('aria-label', 'Afiseaza optiunile');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.appendChild(bpIcon('fa-solid', 'fa-list'));
    wrapper.appendChild(toggle);

    const menu = document.createElement('div');
    menu.className = 'bp-combobox__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    wrapper.appendChild(menu);

    const open = () => {
      closeAllDropdowns(wrapper);
      renderCombobox(input);
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => positionDropdownInViewport(menu, toggle));
    };
    const close = () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      if (menu.hidden) open();
      else close();
      input.focus();
    });
    input.addEventListener('focus', open);
    input.addEventListener('input', open);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        open();
        menu.querySelector('.bp-combobox__option')?.focus();
      } else if (event.key === 'Escape') {
        close();
      }
    });
    menu.addEventListener('click', (event) => {
      const option = event.target.closest('.bp-combobox__option');
      if (!option) return;
      input.value = option.dataset.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      close();
      input.focus();
    });
    menu.addEventListener('keydown', (event) => {
      const options = [...menu.querySelectorAll('.bp-combobox__option')];
      const index = options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        options[(index + 1) % options.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        options[(index - 1 + options.length) % options.length]?.focus();
      } else if (event.key === 'Escape') {
        close();
        input.focus();
      }
    });
  }

  function syncSelectControl(select) {
    const control = select?.closest('.bp-select-control');
    if (!control) return;
    const menu = selectMenuFor(control);
    const sourceOptions = [...select.options];
    const renderedOptions = [...(menu?.querySelectorAll('.bp-select-control__option') || [])];
    const optionsChanged = sourceOptions.length !== renderedOptions.length
      || sourceOptions.some((option, index) => (
        renderedOptions[index]?.dataset.value !== option.value
        || renderedOptions[index]?.textContent !== option.textContent
        || renderedOptions[index]?.disabled !== option.disabled
    ));
    if (menu && optionsChanged) {
      menu.replaceChildren();
      sourceOptions.forEach((sourceOption) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'bp-select-control__option';
        option.dataset.value = sourceOption.value;
        option.setAttribute('role', 'option');
        option.disabled = sourceOption.disabled;
        option.textContent = sourceOption.textContent;
        menu.appendChild(option);
      });
    }
    const selectedOption = select.options[select.selectedIndex];
    const trigger = control.querySelector('.bp-select-control__trigger');
    if (trigger) {
      trigger.querySelector('.bp-select-control__value').textContent = selectedOption?.textContent || '';
      trigger.disabled = select.disabled;
    }
    const sizer = control.querySelector('.bp-select-control__sizer');
    if (sizer) {
      sizer.textContent = sourceOptions.reduce((longest, option) => (
        option.textContent.length > longest.length ? option.textContent : longest
      ), '');
    }
    control.querySelectorAll('.bp-select-control__option').forEach((option) => {
      option.setAttribute('aria-selected', String(option.dataset.value === String(select.value)));
    });
  }

  function enhanceSelect(select) {
    if (!select?.classList?.contains('bp-select') || select.parentElement?.classList.contains('bp-select-control')) {
      return;
    }
    const wrapper = document.createElement('span');
    wrapper.className = 'bp-select-control';
    if (select.classList.contains('bp-data-toolbar__control')) {
      wrapper.classList.add('bp-data-toolbar__control');
    }
    if (select.classList.contains('bp-select--content')) {
      wrapper.classList.add('bp-select-control--content');
    }
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('bp-sr-only');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'bp-select-control__trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.appendChild(textElement('span', 'bp-select-control__value'));
    wrapper.appendChild(trigger);

    if (select.classList.contains('bp-select--content')) {
      const sizer = document.createElement('span');
      sizer.className = 'bp-select-control__sizer';
      sizer.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(sizer);
    }

    const menu = document.createElement('div');
    menu.className = 'bp-select-control__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    wrapper.appendChild(menu);
    wrapper._bpSelectMenu = menu;

    trigger.addEventListener('click', () => {
      syncSelectControl(select);
      const shouldOpen = menu.hidden;
      closeSelectControls(shouldOpen ? wrapper : null);
      if (shouldOpen) openSelectControl(wrapper);
      else closeSelectControl(wrapper);
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
    });

    menu.addEventListener('click', (event) => {
      const option = event.target.closest('.bp-select-control__option');
      if (!option || option.disabled) return;
      select.value = option.dataset.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      syncSelectControl(select);
      closeSelectControls();
      trigger.focus();
    });

    menu.addEventListener('keydown', (event) => {
      const options = [...menu.querySelectorAll('.bp-select-control__option:not(:disabled)')];
      const currentIndex = options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        options[(currentIndex + 1) % options.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        options[(currentIndex - 1 + options.length) % options.length]?.focus();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeSelectControls();
        trigger.focus();
      }
    });

    select.addEventListener('change', () => syncSelectControl(select));
    syncSelectControl(select);
  }

  function enhanceSelects(root = document) {
    if (root.matches?.('select.bp-select')) {
      enhanceSelect(root);
    }
    root.querySelectorAll?.('select.bp-select').forEach(enhanceSelect);
  }

  function enhanceComboboxes(root = document) {
    if (root.matches?.('input.bp-input[list]')) {
      enhanceCombobox(root);
    }
    root.querySelectorAll?.('input.bp-input[list]').forEach(enhanceCombobox);
  }

  function enhanceMobileNav(nav) {
    if (!nav?.classList?.contains('bp-mobile-nav')) return;
    let track = nav.querySelector(':scope > .bp-mobile-nav__track');
    if (!track) {
      const items = [...nav.children].filter((child) => child.classList.contains('bp-mobile-nav__item'));
      if (!items.length) return;

      track = document.createElement('div');
      track.className = 'bp-mobile-nav__track';
      items.forEach((item) => track.appendChild(item));

      nav.replaceChildren(track);
      nav.classList.add('bp-mobile-nav--enhanced');
    }

    const visibleItems = [...track.querySelectorAll('.bp-mobile-nav__item')]
      .filter((item) => !item.hidden && item.getAttribute('aria-hidden') !== 'true' && getComputedStyle(item).display !== 'none');
    const itemCount = visibleItems.length;
    const visibleCount = Math.max(1, Math.min(5, itemCount));
    const isFiveItemNav = nav.classList.contains('bp-mobile-nav--5');
    const reservedCount = isFiveItemNav ? 5 : visibleCount;
    const isFullWidth = isFiveItemNav || itemCount > 5;
    const itemWidthRem = 4.25;
    const gapTerms = Array.from({ length: Math.max(0, reservedCount - 1) }, () => 'var(--bp-mobile-nav-gap)').join(' + ');
    const trackWidth = isFullWidth ? '100%' : `calc(${(reservedCount * itemWidthRem).toFixed(2)}rem${gapTerms ? ` + ${gapTerms}` : ''})`;
    nav.style.setProperty('--bp-mobile-nav-visible', String(visibleCount));
    nav.style.setProperty('--bp-mobile-nav-track-width', trackWidth);
    nav.style.setProperty('--bp-mobile-nav-shell-width', isFullWidth ? '100%' : `calc(${trackWidth.replace(/^calc\((.*)\)$/, '$1')} + (var(--bp-space-1) * 2))`);
    nav.classList.toggle('bp-mobile-nav--scrollable', itemCount > 5);
    requestAnimationFrame(() => {
      visibleItems.find((item) => item.getAttribute('aria-current') === 'page')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    });
  }

  function enhanceMobileNavs(root = document) {
    const closestNav = root.closest?.('.bp-mobile-nav');
    if (closestNav) enhanceMobileNav(closestNav);
    if (root.matches?.('.bp-mobile-nav')) enhanceMobileNav(root);
    root.querySelectorAll?.('.bp-mobile-nav').forEach(enhanceMobileNav);
  }

  const tableCardInteractiveSelector = 'a, button, input, select, textarea, [tabindex], [role="button"], .bp-interactive-text';
  const responsiveTableObservers = new WeakMap();
  const emptyCardValueTokens = new Set(['', '-', '–', '—', 'n/a', 'na', 'null', 'undefined']);

  function isEmptyCardValue(element) {
    if (!element) return true;
    const text = String(element.textContent || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ')
      .trim()
      .toLowerCase();
    if (emptyCardValueTokens.has(text)) return true;
    if (text) return false;
    return !element.querySelector('button, input, select, textarea, img, video, canvas, svg, .bp-icon, [class*="fa-"]');
  }

  function pruneEmptyRecordCardFields(root = document) {
    const lists = [];
    if (root.matches?.('.bp-record-card__details, .bp-data-card__meta')) lists.push(root);
    root.querySelectorAll?.('.bp-record-card__details, .bp-data-card__meta').forEach((list) => lists.push(list));
    lists.forEach((list) => {
      [...list.querySelectorAll(':scope > dt')].forEach((label) => {
        const value = label.nextElementSibling;
        if (!value?.matches('dd') || !isEmptyCardValue(value)) return;
        label.remove();
        value.remove();
      });
      if (!list.querySelector(':scope > dt')) list.remove();
    });
  }

  function cloneTableCardCell(cell, cellIndex) {
    const wrapper = document.createElement('span');
    wrapper.className = 'bp-table-card-value';
    wrapper.dataset.bpProxyCell = String(cellIndex);
    [...cell.childNodes].forEach((node) => wrapper.appendChild(node.cloneNode(true)));
    wrapper.querySelectorAll('.bp-select-control').forEach((control) => {
      const select = control.querySelector(':scope > select');
      if (!select) return;
      select.classList.remove('bp-sr-only');
      control.replaceWith(select);
    });
    wrapper.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    wrapper.querySelectorAll('[for]').forEach((node) => node.removeAttribute('for'));
    wrapper.querySelectorAll(tableCardInteractiveSelector).forEach((node, index) => {
      node.dataset.bpProxyInteractive = String(index);
    });
    return wrapper;
  }

  function normalizeRecordCardField(label) {
    const normalized = String(label || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
    if (['phone', 'telefon', 'tel'].includes(normalized)) return 'phone';
    if (['email', 'e-mail', 'mail'].includes(normalized)) return 'email';
    if (['website', 'site', 'web'].includes(normalized)) return 'website';
    return normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function renderResponsiveTableCards(table) {
    const shell = table?.closest('.bp-table-shell');
    if (!shell) return;
    let cards = shell.nextElementSibling;
    if (!cards?.matches?.(`[data-bp-cards-for="${table.id}"]`)) {
      cards = document.createElement('div');
      cards.className = 'bp-data-cards bp-data-cards--grid';
      cards.dataset.bpCardsFor = table.id;
      shell.after(cards);
    }

    const headers = [...table.querySelectorAll('thead th')];
    const rows = [...table.querySelectorAll('tbody tr')];
    if (!rows.length || (rows.length === 1 && rows[0].cells.length === 1 && rows[0].cells[0].hasAttribute('colspan'))) {
      const message = rows[0]?.textContent?.trim() || 'Nu există înregistrări.';
      const empty = document.createElement('div');
      empty.className = 'bp-empty bp-empty--compact';
      empty.appendChild(textElement('span', '', message));
      cards.replaceChildren(empty);
      return;
    }

    const titleIndex = Math.max(0, Number(table.dataset.bpCardsTitleColumn || 0));
    const subtitleIndex = table.dataset.bpCardsSubtitleColumn === undefined ? -1 : Number(table.dataset.bpCardsSubtitleColumn);
    const headerField = normalizeRecordCardField(table.dataset.bpCardsHeaderField || '');
    const configuredHeaderIndex = Number(table.dataset.bpCardsHeaderColumn ?? -1);
    const headerIndex = headerField
      ? headers.findIndex((header) => normalizeRecordCardField(header.textContent || '') === headerField)
      : configuredHeaderIndex;
    let actionIndex = Number(table.dataset.bpCardsActionColumn ?? -1);
    if (actionIndex < 0) {
      actionIndex = headers.findIndex((header) => /acțiuni|actiuni/i.test(header.textContent || ''));
    }

    cards.replaceChildren(...rows.map((row, rowIndex) => {
      const cells = [...row.cells];
      const article = document.createElement('article');
      article.className = 'bp-record-card';
      article.dataset.bpTableRow = String(rowIndex);

      const header = document.createElement('header');
      header.className = 'bp-record-card__header';
      const titleGroup = document.createElement('div');
      titleGroup.className = 'bp-record-card__title-group';
      const title = document.createElement('span');
      title.className = 'bp-record-card__title';
      if (cells[titleIndex]) title.appendChild(cloneTableCardCell(cells[titleIndex], titleIndex));
      titleGroup.appendChild(title);
      if (subtitleIndex >= 0 && cells[subtitleIndex]) {
        const subtitle = document.createElement('span');
        subtitle.className = 'bp-record-card__subtitle';
        subtitle.appendChild(cloneTableCardCell(cells[subtitleIndex], subtitleIndex));
        titleGroup.appendChild(subtitle);
      }
      header.appendChild(titleGroup);
      if (headerIndex >= 0 && cells[headerIndex] && !isEmptyCardValue(cells[headerIndex])) {
        const headerMeta = document.createElement('div');
        headerMeta.className = 'bp-record-card__header-meta';
        if (headerField) headerMeta.dataset.bpCardField = headerField;
        headerMeta.appendChild(cloneTableCardCell(cells[headerIndex], headerIndex));
        header.appendChild(headerMeta);
      }
      article.appendChild(header);

      const details = document.createElement('dl');
      details.className = 'bp-record-card__details';
      cells.forEach((cell, cellIndex) => {
        if (cellIndex === titleIndex || cellIndex === subtitleIndex || cellIndex === headerIndex || cellIndex === actionIndex) return;
        const label = String(headers[cellIndex]?.textContent || '').trim();
        if (!label) return;
        const fieldKey = normalizeRecordCardField(label);
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        if (fieldKey) {
          dt.dataset.bpCardField = fieldKey;
          dd.dataset.bpCardField = fieldKey;
        }
        dd.appendChild(cloneTableCardCell(cell, cellIndex));
        if (isEmptyCardValue(dd)) return;
        details.append(dt, dd);
      });
      if (details.children.length) article.appendChild(details);

      if (actionIndex >= 0 && (cells[actionIndex]?.textContent?.trim() || cells[actionIndex]?.querySelector(tableCardInteractiveSelector))) {
        const footer = document.createElement('footer');
        footer.className = 'bp-record-card__footer';
        footer.appendChild(cloneTableCardCell(cells[actionIndex], actionIndex));
        article.appendChild(footer);
      }
      return article;
    }));
  }

  function enhanceResponsiveTable(table) {
    if (!table?.matches?.('table[data-bp-responsive-cards]')) return;
    let shell = table.closest('.bp-table-shell');
    if (!shell && table.parentElement) {
      shell = table.parentElement;
      shell.classList.add('bp-table-shell');
    }
    if (!shell) return;
    if (!table.id) table.id = `bp-table-${Math.random().toString(36).slice(2)}`;
    table.dataset.bpCardsEnhanced = 'true';
    shell.classList.add('bp-table-shell--responsive');
    renderResponsiveTableCards(table);
    if (!responsiveTableObservers.has(table)) {
      const observer = new MutationObserver(() => renderResponsiveTableCards(table));
      // Observe the table rather than its initial tbody. Applications may replace the
      // entire tbody while changing views, filters or pagination.
      observer.observe(table, { childList: true, subtree: true, characterData: true });
      responsiveTableObservers.set(table, observer);
    }
  }

  function enhanceResponsiveTables(root = document) {
    if (root.matches?.('table[data-bp-responsive-cards]')) enhanceResponsiveTable(root);
    root.querySelectorAll?.('table[data-bp-responsive-cards]').forEach(enhanceResponsiveTable);
  }

  enhanceSelects();
  enhanceComboboxes();
  enhanceMobileNavs();
  enhanceResponsiveTables();
  enhanceFilterDropdowns();
  pruneEmptyRecordCardFields();
  syncThemeToggles();
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const mutationElement = mutation.target.nodeType === Node.ELEMENT_NODE
        ? mutation.target
        : mutation.target.parentElement;
      const changedDetails = mutationElement?.closest?.('.bp-record-card__details, .bp-data-card__meta');
      if (changedDetails) pruneEmptyRecordCardFields(changedDetails);
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          enhanceSelects(node);
          enhanceComboboxes(node);
          enhanceMobileNavs(node);
          enhanceResponsiveTables(node);
          enhanceFilterDropdowns(node);
          pruneEmptyRecordCardFields(node);
          syncThemeLogos();
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  let dropdownPositionFrame = 0;
  const scheduleOpenDropdownSync = (menu) => {
    cancelAnimationFrame(dropdownPositionFrame);
    dropdownPositionFrame = requestAnimationFrame(() => {
      if (menu) closeAllDropdowns(menu);
      positionOpenDropdowns();
    });
  };

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const target = mutation.target;
      if (!(target instanceof Element)) continue;
      if (target._bpHome && (target.hidden || !target.classList.contains('is-open'))) {
        unportalMenu(target);
        continue;
      }
      const openedMenu = target.matches('[data-bp-floating-menu]:not([hidden]), .bp-filter-dropdown__menu.is-open, .bp-menu-toggle-state.is-open')
        ? target
        : target.matches('.bp-nav-dropdown.is-open')
          ? target.querySelector('.nav-dropdown-menu')
          : null;
      if (openedMenu) scheduleOpenDropdownSync(openedMenu);
    }
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });

  function openDialog(dialog, trigger = document.activeElement) {
    if (!dialog) return;
    activeDialog = dialog;
    activeTrigger = trigger;
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      dialog.querySelector('[autofocus], input, select, textarea, button, a[href]')?.focus();
    });
  }

  function closeDialog(dialog = activeDialog) {
    if (!dialog) return;
    closeSelectControls();
    dialog._bpBeforeClose?.();
    dialog.hidden = true;
    document.body.style.overflow = '';
    activeDialog = null;
    activeTrigger?.focus?.();
    activeTrigger = null;
  }

  function ensureMobileFilterSheet() {
    if (mobileFilterSheet?.isConnected) return mobileFilterSheet;
    const backdrop = document.createElement('div');
    backdrop.className = 'bp-modal-backdrop bp-filter-sheet-backdrop';
    backdrop.hidden = true;
    const sheet = document.createElement('section');
    sheet.className = 'bp-modal bp-filter-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'bpMobileFilterTitle');

    const header = document.createElement('header');
    header.className = 'bp-modal__header';

    const title = textElement('h2', 'bp-heading-3', 'Filtre');
    title.id = 'bpMobileFilterTitle';

    const closeButton = document.createElement('button');
    closeButton.className = 'bp-icon-button';
    closeButton.type = 'button';
    closeButton.dataset.bpDialogClose = '';
    closeButton.setAttribute('aria-label', 'Închide filtrele');
    closeButton.title = 'Închide';
    closeButton.appendChild(bpIcon('fa-solid', 'fa-xmark'));

    header.append(title, closeButton);
    sheet.append(header, textElement('div', 'bp-modal__body bp-filter-sheet__body'));
    backdrop.appendChild(sheet);
    backdrop._bpBeforeClose = () => {
      unportalAllMenus();
      mobileFilterSources.forEach(({ source, placeholder }) => {
        source.classList.remove('bp-mobile-filter-source--mounted');
        placeholder.replaceWith(source);
      });
      mobileFilterSources = [];
      backdrop.querySelector('.bp-filter-sheet__body')?.replaceChildren();
    };
    document.body.appendChild(backdrop);
    mobileFilterSheet = backdrop;
    return backdrop;
  }

  function openMobileFilterSheet(trigger) {
    const sheet = ensureMobileFilterSheet();
    if (!sheet.hidden) closeDialog(sheet);
    const body = sheet.querySelector('.bp-filter-sheet__body');
    const title = sheet.querySelector('#bpMobileFilterTitle');
    if (!body || !title) return;
    title.textContent = trigger.dataset.bpMobileFilterTitle || 'Filtre';
    const selectors = String(trigger.dataset.bpMobileFilterOpen || '').split(',').map(value => value.trim()).filter(Boolean);
    mobileFilterSources = selectors.map(selector => document.querySelector(selector)).filter(Boolean).map(source => {
      const placeholder = document.createComment(`bp-filter-source:${source.id || 'anonymous'}`);
      source.before(placeholder);
      source.classList.add('bp-mobile-filter-source--mounted');
      body.appendChild(source);
      return { source, placeholder };
    });
    if (!mobileFilterSources.length) return;
    openDialog(sheet, trigger);
  }

  function closeFloatingMenus(except = null) {
    document.querySelectorAll('[data-bp-floating-menu]').forEach((menu) => {
      if (menu === except) return;
      menu.hidden = true;
      document.querySelectorAll(`[data-bp-menu-toggle="#${menu.id}"]`).forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Handle menu triggers before application-level click handlers can stop
  // propagation. This keeps the shared overflow component reliable in legacy
  // applications that still own document or toolbar click listeners.
  document.addEventListener('click', (event) => {
    const legacyToggle = event.target.closest('[aria-controls], .nav-dropdown > [data-menu]');
    if (legacyToggle && !legacyToggle.closest('[data-bp-menu-toggle]')) {
      const menuId = legacyToggle.getAttribute('aria-controls') || '';
      const menu = menuId ? document.getElementById(menuId) : legacyToggle.closest('.nav-dropdown')?.querySelector('.nav-dropdown-menu');
      if (menu?.matches?.('.bp-filter-dropdown__menu, .bp-menu-toggle-state, .nav-dropdown-menu')) {
        closeAllDropdowns(menu);
        requestAnimationFrame(positionOpenDropdowns);
        setTimeout(positionOpenDropdowns, 0);
      }
    }

    const floatingToggle = event.target.closest('[data-bp-menu-toggle]');
    if (!floatingToggle) return;
    const selector = floatingToggle.dataset.bpMenuToggle;
    const menu = selector ? document.querySelector(selector) : null;
    if (!menu) return;
    event.preventDefault();
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeAllDropdowns(willOpen ? menu : null);
    menu.hidden = !willOpen;
    menu.classList.toggle('is-open', willOpen);
    floatingToggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) {
      requestAnimationFrame(() => {
        enhanceFilterMenu(menu);
        syncFilterMenuSearchVisibility(menu);
        positionDropdownInViewport(menu, floatingToggle);
        const autofocus = menu.querySelector('[data-bp-menu-autofocus]');
        if (!autofocus?.closest('.bp-dropdown-search, .bp-filter-dropdown__search') || menu.classList.contains('bp-filter-menu--search-visible')) {
          autofocus?.focus({ preventScroll: true });
          autofocus?.select?.();
        }
      });
    }
  }, true);

  document.addEventListener('click', (event) => {
    document.querySelectorAll('select.bp-select').forEach(syncSelectControl);

    const mobileFilterOpen = event.target.closest('[data-bp-mobile-filter-open]');
    if (mobileFilterOpen) {
      event.preventDefault();
      openMobileFilterSheet(mobileFilterOpen);
      return;
    }

    const tableCardTarget = event.target.closest('.bp-menu-portal') ? null : event.target.closest('[data-bp-cards-for] [data-bp-proxy-cell]');
    if (tableCardTarget) {
      const cards = tableCardTarget.closest('[data-bp-cards-for]');
      const table = document.getElementById(cards?.dataset.bpCardsFor || '');
      const rowIndex = Number(tableCardTarget.closest('[data-bp-table-row]')?.dataset.bpTableRow || -1);
      const cellIndex = Number(tableCardTarget.dataset.bpProxyCell || -1);
      const originalCell = table?.tBodies?.[0]?.rows?.[rowIndex]?.cells?.[cellIndex];
      const interactive = event.target.closest('[data-bp-proxy-interactive]');
      if (originalCell) {
        if (interactive?.matches('input, select, textarea')) return;
        event.preventDefault();
        event.stopPropagation();
        if (interactive) {
          originalCell.querySelectorAll(tableCardInteractiveSelector)[Number(interactive.dataset.bpProxyInteractive || 0)]?.click();
        } else {
          originalCell.click();
        }
      }
      return;
    }

    const themeToggle = event.target.closest('[data-bp-theme-toggle]');
    if (themeToggle) {
      setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark');
      return;
    }

    const passwordToggle = event.target.closest('[data-bp-password-toggle]');
    if (passwordToggle) {
      const input = document.querySelector(passwordToggle.dataset.bpPasswordToggle);
      if (input) {
        const showPassword = input.type === 'password';
        input.type = showPassword ? 'text' : 'password';
        passwordToggle.setAttribute('aria-pressed', String(showPassword));
        passwordToggle.setAttribute('aria-label', showPassword ? 'Ascunde parola' : 'Afiseaza parola');
        passwordToggle.setAttribute('title', showPassword ? 'Ascunde parola' : 'Afiseaza parola');
        const icon = passwordToggle.querySelector('.bp-icon');
        icon?.classList.toggle('fa-eye', !showPassword);
        icon?.classList.toggle('fa-eye-slash', showPassword);
      }
      return;
    }

    const dialogOpen = event.target.closest('[data-bp-dialog-open]');
    if (dialogOpen) {
      openDialog(document.querySelector(dialogOpen.dataset.bpDialogOpen), dialogOpen);
      return;
    }

    const dialogClose = event.target.closest('[data-bp-dialog-close]');
    if (dialogClose) {
      closeDialog(dialogClose.closest('.bp-modal-backdrop'));
      return;
    }

    const floatingItem = event.target.closest('[data-bp-floating-menu] .bp-overflow__item');
    if (floatingItem) {
      closeFloatingMenus();
      return;
    }

    if (!event.target.closest('.bp-combobox')) closeComboboxes();
    if (!eventTargetInsideSelect(event)) closeSelectControls();
    if (!event.target.closest('[data-bp-floating-root]')) closeFloatingMenus();
    if (!event.target.closest('.bp-filter-dropdown, .nav-dropdown, .bp-menu-portal')) closeLegacyDropdowns();
  });

  document.addEventListener('scroll', (event) => {
    if (event.target instanceof Element && event.target.closest('.bp-select-control__menu--portal')) return;
    closeSelectControls();
    positionOpenDropdowns();
  }, true);

  window.addEventListener('resize', () => {
    closeSelectControls();
    positionOpenDropdowns();
  });
  window.matchMedia?.('(min-width: 48rem)').addEventListener?.('change', event => {
    if (event.matches && mobileFilterSheet && !mobileFilterSheet.hidden) closeDialog(mobileFilterSheet);
  });
  window.visualViewport?.addEventListener('resize', () => {
    closeSelectControls();
    positionOpenDropdowns();
  });

  document.addEventListener('input', (event) => {
    const filterSearch = event.target.closest('[data-bp-filter-menu-search]');
    if (filterSearch) {
      const menu = filterSearch.closest('.bp-filter-menu');
      const query = String(filterSearch.value || '').trim().toLocaleLowerCase();
      filterMenuItems(menu).forEach((item) => {
        const text = String(item.textContent || '').toLocaleLowerCase();
        item.hidden = !!query && !text.includes(query);
      });
      positionOpenDropdowns();
      return;
    }

    const control = event.target.closest('[data-bp-cards-for] [data-bp-proxy-interactive]');
    if (!control?.matches('input, select, textarea')) return;
    const cards = control.closest('[data-bp-cards-for]');
    const table = document.getElementById(cards?.dataset.bpCardsFor || '');
    const proxyCell = control.closest('[data-bp-proxy-cell]');
    const rowIndex = Number(control.closest('[data-bp-table-row]')?.dataset.bpTableRow || -1);
    const cellIndex = Number(proxyCell?.dataset.bpProxyCell || -1);
    const originalCell = table?.tBodies?.[0]?.rows?.[rowIndex]?.cells?.[cellIndex];
    const original = originalCell?.querySelectorAll(tableCardInteractiveSelector)[Number(control.dataset.bpProxyInteractive || 0)];
    if (!original) return;
    if ('checked' in control) original.checked = control.checked;
    original.value = control.value;
    original.dispatchEvent(new Event('input', { bubbles: true }));
    original.dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSelectControls();
      closeComboboxes();
      closeLegacyDropdowns();
      if (activeDialog) closeDialog();
      else closeFloatingMenus();
      return;
    }

    if (event.key !== 'Tab' || !activeDialog) return;
    const focusable = [...activeDialog.querySelectorAll(focusableSelector)].filter((element) => !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ── Toast notifications ─────────────────────────────────────────── */

  let toastStack = null;

  function getToastStack() {
    if (toastStack?.isConnected) return toastStack;
    toastStack = document.createElement('div');
    toastStack.className = 'bp-toast-stack';
    toastStack.setAttribute('aria-label', 'Notificări');
    (document.body || document.documentElement).appendChild(toastStack);
    return toastStack;
  }

  /**
   * Afișează o notificare temporară.
   * @param {string} message Mesaj text simplu; nu este interpretat ca HTML.
   * @param {'success'|'danger'|'error'|'warning'|'info'} type Tip semantic.
   * @param {number} duration Milisecunde până la închidere; 0 păstrează mesajul deschis.
   * @param {Function} onDismiss Callback apelat o singură dată la închidere.
   * @returns {{ element: HTMLElement, dismiss: Function } | null}
   */
  function showToast(message, type = 'info', duration = 4000, onDismiss) {
    const normalizedType = type === 'error' ? 'danger' : type;
    const validType = ['success', 'danger', 'warning', 'info'].includes(normalizedType) ? normalizedType : 'info';
    const content = String(message ?? '').trim();
    if (!content) return null;

    const icons = {
      success: 'fa-circle-check',
      danger: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };
    const toast = document.createElement('div');
    toast.className = `bp-toast bp-toast--${validType}`;
    toast.setAttribute('role', validType === 'danger' ? 'alert' : 'status');
    toast.setAttribute('aria-live', validType === 'danger' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');

    const icon = bpIcon('fa-solid', icons[validType]);
    const text = textElement('span', 'bp-toast__message', content);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'bp-toast__close';
    close.setAttribute('aria-label', 'Închide notificarea');
    close.appendChild(bpIcon('fa-solid', 'fa-xmark'));
    toast.append(icon, text, close);

    let dismissed = false;
    let timer = null;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      if (timer) window.clearTimeout(timer);
      toast.classList.remove('is-visible');
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 240);
      if (typeof onDismiss === 'function') onDismiss();
      window.dispatchEvent(new CustomEvent('bp:toastdismiss', { detail: { element: toast, type: validType } }));
    };

    close.addEventListener('click', dismiss);
    getToastStack().appendChild(toast);
    window.requestAnimationFrame(() => toast.classList.add('is-visible'));
    if (Number(duration) > 0) timer = window.setTimeout(dismiss, Number(duration));
    window.dispatchEvent(new CustomEvent('bp:toast', { detail: { element: toast, dismiss, type: validType } }));
    return { element: toast, dismiss };
  }

  // API global simplu pentru aplicațiile care încarcă DS-ul ca script clasic.
  window.BPToast = showToast;

  window.BPDesignSystem = {
    openDialog,
    closeDialog,
    closeFloatingMenus,
    closeAllDropdowns,
    positionOpenDropdowns,
    setTheme,
    enhanceSelect,
    enhanceSelects,
    syncSelectControl,
    enhanceResponsiveTable,
    enhanceResponsiveTables,
    enhanceMobileNavs,
    enhanceFilterDropdowns,
    pruneEmptyRecordCardFields,
    toast: showToast
  };
  window.dispatchEvent(new CustomEvent('bp:ready', { detail: { version: document.documentElement.dataset.bpVersion || '' } }));
})();
