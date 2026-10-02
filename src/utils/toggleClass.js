export function toggleClass(elementId, className) {
  const el = document.getElementById(elementId);

  if (!el) return;

  const handleOutsideClick = (event) => {
    if (!el.contains(event.target)) {
      el.classList.add(className);
      document.removeEventListener('click', handleOutsideClick);
    }
  };

  const isOpen = el.classList.toggle(className);

  if (!isOpen) {
    document.addEventListener('click', handleOutsideClick);
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
}