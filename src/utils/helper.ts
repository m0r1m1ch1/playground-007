export const focusElement = (element: HTMLElement) => {
  if (document.activeElement === element) return;
  element.tabIndex = -1;
  element.focus();
};

export const checkModifiedEvent = (event: React.KeyboardEvent | React.MouseEvent | KeyboardEvent | MouseEvent) => {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
};

export const scrollToElement = (element: HTMLElement) => {
  const offsetBuffer = 2;
  const offsetValue = document.documentElement.style.getPropertyValue('--header-height');
  const offset = parseFloat(offsetValue) - offsetBuffer || 0;
  const rect = element.getBoundingClientRect();
  const rectTop = rect.top;
  const position = rectTop + window.pageYOffset - offset;

  window.addEventListener('scrollend', () => focusElement(element), { once: true });

  window.scrollTo({
    top: position,
    behavior: 'instant',
  });
};
