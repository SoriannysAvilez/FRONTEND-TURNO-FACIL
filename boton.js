const API_URL = "http://localhost:3000";
 
const form = document.getElementById("formLogin");
const errorEl = document.getElementById("errorLogin");
const botonSubmit = form.querySelector("button[type='submit']");

function mostrarError(mensaje) {
  errorEl.textContent = mensaje;
  errorEl.classList.remove("hidden");
}
 
function ocultarError() {
  errorEl.classList.add("hidden");
}
 
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  ocultarError();
 
  const email = form.email.value.trim();
  const password = form.password.value;
 
  botonSubmit.disabled = true;
  botonSubmit.textContent = "Ingresando...";
 
  try {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
 
    const datos = await respuesta.json();
 
    if (!respuesta.ok) {
      mostrarError(datos.error?.mensaje ?? "No se pudo iniciar sesión");
      return;
    }
 
    // Guarda el token para usarlo en las siguientes peticiones autenticadas
    // (ej: Authorization: Bearer <token> en /reservas, /auth/yo, etc.)
    localStorage.setItem("tf_token", datos.token);
    localStorage.setItem("tf_usuario", JSON.stringify(datos.usuario));
 
    alert(`¡Bienvenido, ${datos.usuario.nombre}!`);
    // window.location.href = "/dashboard.html"; // redirige a donde corresponda
  } catch (error) {
    mostrarError("No se pudo conectar con el servidor");
  } finally {
    botonSubmit.disabled = false;
    botonSubmit.textContent = "Ingresar";
  }
});
