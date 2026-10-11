(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const modal = document.querySelector('[data-demo-modal]');
  const confirmModal = document.querySelector('[data-confirm-modal]');
  const profitModal = document.querySelector('[data-profit-modal]');
  let activeDialog = null;
  let dialogTrigger = null;

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function openDialog(dialog, trigger) {
    if (!dialog) return;
    activeDialog = dialog;
    dialogTrigger = trigger || document.activeElement;
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      dialog.querySelector('[autofocus], input, select, textarea, button')?.focus();
    });
  }

  function closeDialog(dialog = activeDialog) {
    if (!dialog) return;
    dialog.hidden = true;
    document.body.style.overflow = '';
    activeDialog = null;
    dialogTrigger?.focus?.();
    dialogTrigger = null;
  }

  function setTheme(theme) {
    if (window.BPTheme?.set) window.BPTheme.set(theme);
    else root.dataset.bpTheme = theme;
    syncGalleryTheme();
  }

  function syncGalleryTheme() {
    const theme = root.dataset.bpTheme === 'dark' ? 'dark' : 'light';
    const icon = themeButton?.querySelector('.bp-icon');
    if (icon) {
      icon.classList.toggle('fa-sun', theme === 'dark');
      icon.classList.toggle('fa-moon', theme !== 'dark');
    }
    themeButton?.setAttribute('aria-label', theme === 'dark' ? 'Activează tema luminoasă' : 'Activează tema întunecată');
  }

  syncGalleryTheme();
  window.addEventListener('bp:themechange', syncGalleryTheme);

  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.bpTheme === 'dark' ? 'light' : 'dark');
  });

  document.querySelectorAll('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => openDialog(modal, button));
  });

  modal?.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(modal));
  });

  document.querySelectorAll('[data-show-toast]').forEach((button) => {
    button.addEventListener('click', () => {
      window.BPToast?.('Modificările au fost salvate.', 'success');
    });
  });

  document.querySelectorAll('.bp-filter').forEach((filter) => {
    filter.addEventListener('click', () => {
      filter.parentElement?.querySelectorAll('.bp-filter').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === filter));
      });
    });
  });

  document.querySelectorAll('[data-popover-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const target = document.querySelector(button.dataset.popoverToggle);
      document.querySelectorAll('.bp-popover').forEach((popover) => {
        if (popover !== target) popover.hidden = true;
      });
      if (target) target.hidden = !target.hidden;
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.bp-header-tools')) {
      document.querySelectorAll('.bp-popover').forEach((popover) => {
        popover.hidden = true;
      });
    }
  });

  document.querySelectorAll('.bp-segmented-control__item').forEach((button) => {
    button.addEventListener('click', () => {
      button.parentElement?.querySelectorAll('.bp-segmented-control__item').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
    });
  });

  document.querySelectorAll('[data-toggle-form-section]').forEach((control) => {
    control.addEventListener('change', () => {
      const target = document.querySelector(control.dataset.toggleFormSection);
      if (target) target.hidden = control.value !== 'yes';
    });
  });

  document.querySelectorAll('[data-open-confirm]').forEach((button) => {
    button.addEventListener('click', () => openDialog(confirmModal, button));
  });

  confirmModal?.querySelectorAll('[data-close-confirm]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(confirmModal));
  });

  document.querySelectorAll('[data-open-profit-modal]').forEach((button) => {
    button.addEventListener('click', () => openDialog(profitModal, button));
  });

  profitModal?.querySelectorAll('[data-close-profit-modal]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(profitModal));
  });

  document.querySelectorAll('[data-overflow-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const menu = document.querySelector(button.dataset.overflowToggle);
      document.querySelectorAll('.bp-overflow__menu').forEach((item) => {
        if (item !== menu) item.hidden = true;
      });
      if (menu) {
        menu.hidden = !menu.hidden;
        button.setAttribute('aria-expanded', String(!menu.hidden));
      }
    });
  });

  document.querySelectorAll('[data-demo-loading]').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.add('is-loading');
      button.disabled = true;
      window.setTimeout(() => {
        button.classList.remove('is-loading');
        button.disabled = false;
      }, 1600);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeDialog) {
      closeDialog();
      return;
    }
    if (event.key !== 'Tab' || !activeDialog) return;
    const focusable = [...activeDialog.querySelectorAll(focusableSelector)].filter((item) => !item.hidden);
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

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.bp-overflow')) {
      document.querySelectorAll('.bp-overflow__menu').forEach((menu) => {
        menu.hidden = true;
      });
    }
  });

})();
