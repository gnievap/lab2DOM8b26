const data = [
  { id: "p01", title: "Aurora", desc: "Luz suave y cielo polar", src: "https://picsum.photos/id/1018/1200/675" },
  { id: "p02", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1015/1200/675" },
  { id: "p03", title: "Ciudad", desc: "Atardecer urbano", src: "https://picsum.photos/id/1011/1200/675" },
  { id: "p04", title: "Bosque", desc: "Verde profundo", src: "https://picsum.photos/id/1020/1200/675" },
  { id: "p05", title: "Mar", desc: "Horizonte y calma", src: "https://picsum.photos/id/1016/1200/675" },
  { id: "p06", title: "Ruta", desc: "Camino en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

// Recuperar elementos del DOM
const thumbs = document.querySelector("#thumbs"); //miniaturas
const heroImg = document.querySelector("#heroImg");  // imagen principal
const heroTitle = document.querySelector("#heroTitle"); // título de la imagen
const heroDesc = document.querySelector("#heroDesc"); // descripción de la imagen
const counter = document.querySelector("#counter"); // contador de imágenes
const likeBtn = document.querySelector("#likeBtn"); // botón de "me gusta"

// Trabajar con el estado de la aplicación
let currentIndex = 0; // Índice de la imagen actual
const likes ={}; // Objeto para almacenar los "me gusta" por imagen

// Renderizar las miniaturas
function renderThumbs() {
  thumbs.innerHTML = data.map((item, index) => {
    return `
      <article class="thumb ${index === currentIndex ? "active" : ""}" data-index="${index}">
        <span class="badge">${index + 1}</span>
        <img src="${item.src}" alt="${item.title}" />
      </article>
    `;
   }).join("");
}

renderThumbs(); // Llamar a la función para mostrar las miniaturas