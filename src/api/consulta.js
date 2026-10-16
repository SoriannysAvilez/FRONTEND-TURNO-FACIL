export const URL_BASE = 'http://localhost:3000';

// Única función encargada de hablar con el backend: arma cabeceras,
// valida la respuesta y lanza Error(mensaje) con el error del backend.
async function request(ruta, { method = 'GET', body, token } = {}) {
  const cabeceras = {};

  if (body !== undefined) cabeceras['Content-Type'] = 'application/json';
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method,
    headers: cabeceras,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content: no hay cuerpo que parsear.
  if (respuesta.status === 204) return null;

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje = datos?.error?.mensaje ?? `HTTP ${respuesta.status}`;
    const error = new Error(mensaje);
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}

// GET /servicios (público) → desempaqueta el envoltorio { datos, paginacion }.
export async function getServicios(params = {}) {
  const query = new URLSearchParams({ limite: '50', ...params });
  const respuesta = await request(`/servicios?${query.toString()}`);
  return respuesta.datos;
}

// Reservas
export function getReservas(token) {
  return request('/api/v1/appointments', { token });
}

export function getReserva(token, id) {
  return request(`/api/v1/appointments/${id}`, { token });
}

// Reserva pública: token puede ser null/undefined (paciente sin sesión)
// y en ese caso no se envía cabecera Authorization.
export function crearReserva(token, payload) {
  return request('/api/v1/appointments', { method: 'POST', body: payload, token });
}

export function actualizarReserva(token, id, payload) {
  return request(`/api/v1/appointments/${id}`, { method: 'PUT', body: payload, token });
}

export function borrarReserva(token, id) {
  return request(`/api/v1/appointments/${id}`, { method: 'DELETE', token });
}

// Autenticación
export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function getUsuario(token) {
  return request('/auth/yo', { token });
}

export function registro(datos) {
  return request('/auth/registro', { method: 'POST', body: datos });
}

// Token guardado por LoginForm tras iniciar sesión.
export function getToken() {
  return localStorage.getItem('tf_token');
}
