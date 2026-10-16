// Alterna una clase de estado (p. ej. 'hidden') en un elemento y, mientras
// el elemento está visible, cierra de vuelta con el primer clic fuera de él.
const listeners = new WeakMap();

export function toggleClass(elementId, className) {
  const el = document.getElementById(elementId);

  if (!el) return;

  // El botón que controla el elemento (patrón aria-controls) mantiene aria-expanded.
  const disparador = document.querySelector(`[aria-controls="${elementId}"]`);

  const cerrar = () => {
    el.classList.add(className);
    disparador?.setAttribute('aria-expanded', 'false');

    const listener = listeners.get(el);
    if (listener) {
      document.removeEventListener('click', listener);
      listeners.delete(el);
    }
  };

  const handleOutsideClick = (event) => {
    if (el.contains(event.target)) return;
    cerrar();
  };

  if (el.classList.contains(className)) {
    // Estaba cerrado → abrir.
    el.classList.remove(className);
    disparador?.setAttribute('aria-expanded', 'true');

    // Se difiere un tick para que el mismo click que abrió no burbujee
    // a document y no cierre el menú al instante.
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
      listeners.set(el, handleOutsideClick);
    }, 0);
  } else {
    // Estaba abierto → cerrar.
    cerrar();
  }
}
