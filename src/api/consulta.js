export const URL_BASE ="http://localhost:3000/"

const response = await fetch(`${URL_BASE}servicios?pagina=1&limite=5&orden=precio`);
export const servicios =await  response.json();
