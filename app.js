const data = [
  { id: "p01", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1018/1200/675" },
  { id: "p02", title: "Mar", desc: "Horizonte y calma", src: "https://picsum.photos/id/1015/1200/675" },
  { id: "p03", title: "Río", desc: "Tranquilidad", src: "https://picsum.photos/id/1011/1200/675" },
  { id: "p04", title: "Bosque", desc: "Alaska salvaje", src: "https://picsum.photos/id/1020/1200/675" },
  { id: "p05", title: "Cañón", desc: "Desierto rojizo", src: "https://picsum.photos/id/1016/1200/675" },
  { id: "p06", title: "Ruta", desc: "Camino en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

// Recuperar elementos del DOM
const thumbs = document.querySelector("#thumbs"); //miniaturas
const heroImg = document.querySelector("#heroImg");  // imagen principal
const heroTitle = document.querySelector("#heroTitle"); // título de la imagen
const heroDesc = document.querySelector("#heroDesc"); // descripción de la imagen
const counter = document.querySelector("#counter"); // contador de imágenes
const likeBtn = document.querySelector("#likeBtn"); // botón de "me gusta"

const prevBtn = document.querySelector("#prevBtn"); // botón de "anterior"
const nextBtn = document.querySelector("#nextBtn"); // botón de "siguiente"
const playBtn = document.querySelector("#playBtn"); // botón de "reproducir"

// Trabajar con el estado de la aplicación
let currentIndex = 0; // Índice de la imagen actual
const likes ={}; // Objeto para almacenar los "me gusta" por imagen

let autoPlayId = null; // Variable para almacenar el ID del intervalo de autoplay
let isPlaying = false; // Estado de reproducción automática
const AUTO_TIME = 1500; // Tiempo entre cambios automáticos (3 segundos)

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

// Función para mostrar la imagen principal
function renderHero(index) {
  const item = data[index];

  // Actualizar la imagen principal
  heroImg.src = item.src;
  heroImg.alt = item.title;

  // Actualizar el título y la descripción
  heroTitle.textContent = item.title;
  heroDesc.textContent = item.desc;

  // Actualizar el contador
  counter.textContent = `${index + 1} / ${data.length}`;

  // Recorrer miniaturas para marcar la activa
  document.querySelectorAll(".thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  // Revisar si la imagen actual tiene like
  const isLiked = likes[item.id] === true;

  // Cambiar el simbolo del botón
  likeBtn.textContent = isLiked ? "❤️" : "🤍";

  // Aplicar o quitar la clase visual
  likeBtn.classList.toggle("on", isLiked);
}

// Listener para clicks en las miniaturas
thumbs.addEventListener("click", (e) => {
  const thumb = e.target.closest(".thumb");
  if (!thumb) return; // Si no se hizo click en una miniatura, salir

  currentIndex = Number(thumb.dataset.index); // Actualizar el índice actual
  renderHero(currentIndex); // Renderizar la imagen principal con el nuevo índice
 });

 // Listener para el botón de "me gusta"
 likeBtn.addEventListener("click", () => {
  const currentItem = data[currentIndex];
  // Alternar el estado de "me gusta"
  likes[currentItem.id] = !likes[currentItem.id]; 

  const isLiked = likes[currentItem.id]; // Verificar el nuevo estado
  likeBtn.textContent = isLiked ? "❤️" : "🤍"; 
  likeBtn.classList.toggle("on", isLiked); // Aplicar o quitar la clase visual
  likeBtn.setAttribute("aria-pressed", isLiked); // Actualizar el atributo ARIA
 });

 // Cambiar el botón de play a pause
function updatePlayButton() {
  playBtn.textContent = isPlaying ? "⏸️" : "▶️";
  playBtn.dataset.state = isPlaying ? "pause" : "play";
}

renderThumbs(); // Llamar a la función para mostrar las miniaturas
renderHero(currentIndex); // Mostrar la imagen inicial