const data = [
  { id: "p01", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1018/1200/675" },
  { id: "p02", title: "Mar", desc: "Horizonte y calma", src: "https://picsum.photos/id/1015/1200/675" },
  { id: "p03", title: "Río", desc: "Tranquilidad", src: "https://picsum.photos/id/1011/1200/675" },
  { id: "p04", title: "Bosque", desc: "Alaska salvaje", src: "https://picsum.photos/id/1020/1200/675" },
  { id: "p05", title: "Cañón", desc: "Desierto rojizo", src: "https://picsum.photos/id/1016/1200/675" },
  { id: "p06", title: "Ruta", desc: "Camino en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

// Recuperar elementos del DOM
const frame = document.querySelector(".frame");
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
const AUTO_TIME = 2500; // Tiempo entre cambios automáticos (2 segundos y medio)

// dots y tracks no existen en el DOM actual
// se intentan buscar, pero si no están se crearán
// usando js
let dots = document.querySelector("#dots");
let track = document.querySelector(".track");

// variables para detectar swipe (deslizamiento)
let startX = 0;
let currentX = 0;
let isDragging = false;
let moved = false;
// distancia mínima para considerar un swipe
const SWIPE_THRESHOLD = 50;

// para usar el modal
let modal = null;
let modalImg = null;
let modalTitle = null;
let modalDesc = null;
let modalCounter = null;
let modalPrevBtn = null;
let modalNextBtn = null;
let modalCloseBtn = null;
let zoomInBtn = null;
let zoomOutBtn = null;
let zoomResetBtn = null;
let modalScale = 1;

// Crear un track del carrusel
// Crea un contenedor .track que tendrá todas la imágenes
// alineadas horizontalmente
// Es la base del efecto slide con translateX
function createTrack(){
  //Si existe no hacer nada
  if ( track ) return;

  // Si no existe, crear el track
  track = document.createElement("div");
  track.className = "track";

  data.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.title;
    track.appendChild(img);
  });
  frame.prepend(track);
}

// Crear dots
// Crear los botones indicadores del carrusel
// Cada dot va a representar una imagen
// El dot activo debe coincidir con currentIndex
function createDots() {
  if ( !dots ) {
    dots = document.createElement("div");
    dots.id = "dots";
    dots.className = "dots";
    frame.appendChild(dots);
  }

  dots.innerHTML = data.map((_, index)=>{
    return `
      <button
       class = "dot ${index === currentIndex ?? "active"}"
       type="button"
       data-index="${index}"
       aria-label="Ir a la imagen ${index + 1}">
      </button>
    `;
  }).join("");
}

function updateTrack(animate = true){
  if (!track) return;

  track.style.transition = animate ? "transform .45s ease" : "none";
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateMeta(){
  const item = data[currentIndex];
  heroTitle.textContent = item.title;
  heroDesc.textContent = item.desc;
  counter.textContent = `${currentIndex + 1}/ ${data.length}`;
}

function updateThumbs(){
  document.querySelectorAll(".thumb").forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentIndex);
  });
}

function updateDots(){
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
    dot.setAttribute("aria-pressed", index === currentIndex);
  });
}

function updateLikeBtn(){
  const currentItem = data[currentIndex];
  const isLiked = likes[currentItem.id]; // Verificar el nuevo estado
  likeBtn.textContent = isLiked ? "❤️" : "🤍"; 
  likeBtn.classList.toggle("on", isLiked); // Aplicar o quitar la clase visual
  likeBtn.setAttribute("aria-pressed", isLiked); // Actualizar el atributo ARIA
}







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
  updateLikeBtn();

   });

 // Cambiar el botón de play a pause
function updatePlayButton() {
  playBtn.textContent = isPlaying ? "⏸️" : "▶️";
  playBtn.dataset.state = isPlaying ? "pause" : "play";
}

function changeSlide( newIndex ){
  heroImg.classList.add("fade-out"); // Agregar clase para animación de salida
  setTimeout(() => {
    currentIndex = newIndex; // Actualizar el índice actual
    renderHero(currentIndex); // Renderizar la nueva imagen principal
    heroImg.classList.remove("fade-out"); // Quitar clase para animación de entrada
  }, 350);
}

function nextSlide() {
  const newIndex = (currentIndex + 1) % data.length; // Calcular el índice de la siguiente imagen
  changeSlide(newIndex);
}

function prevSlide() {
  const newIndex = (currentIndex - 1 + data.length) % data.length; // Calcular el índice de la imagen anterior
  changeSlide(newIndex);
}

function startAutoPlay(){
  autoPlayId = setInterval(() => {
    nextSlide();
  }, AUTO_TIME);
  isPlaying = true;
  updatePlayButton();
}

function stopAutoPlay(){
  clearInterval(autoPlayId);
  autoPlayId = null;
  isPlaying = false;
  updatePlayButton();
}

function toggleAutoPlay(){
  if ( isPlaying ){
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

// Renderizar la interfaz cada vez que cambia currentIndex
function renderAll(animate = true){
  updateTrack(animate);
  updateMeta();
  updateThumbs();
  updateDots();
  updateLikeBtn();
}

// Animación pop del like
// Agrega o elimina la clase pop para reiniciar la animacion CSS al dar click
function animateLikePop(){
  likeBtn.classList.remove("pop");
  void likeBtn.offsetWidth;
  likeBtn.classList.add("pop");
}

// Manejo de SWIPE - inicio
// Registra la posición inicial del puntero y
// desactiva temporalmente la transición 
function handlePointerDown( e ) {
  startX = e.clientX;
  currentX = e.clientX;
  isDragging = true;
  moved = false;

  if ( track ){
    track.style.transition = "none";
  }
}

// Manejo de SWIPE - movimiento
// Actualiza la posición del puntero
// si el movimiento supera 5px, se considera arrastre
function handlerPointerMove( e ){
  if ( !isDragging ) return;

  currentX = e.clientX;
  const diff = currentX - startX;

  if ( Math.abs(diff) > 5 ){
    moved = true;
  }
}

// Manejo de SWIPE - FIN
// Al soltar el mouse, se calcula la distancia recorrida
// Si supera el umbral, cambia la imagen
// Si no, solo regresa el track a su sitio
function handlePointerUp(){
  if ( !isDragging ) return;

  const diff = currentX - startX;
  isDragging = false;

  if ( Math.abs(diff) >= SWIPE_THRESHOLD ){
    if ( diff < 0 ){
      nextSlide();
    }
    else {
      prevSlide();
    }
  } else {
    updateTrack( true );
  }
}



nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
playBtn.addEventListener("click", toggleAutoPlay);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "ArrowLeft") {
    prevSlide();
  }
});

// Eventos de SWIPE con el mouse
frame.addEventListener("pointerdown", handlePointerDown);
frame.addEventListener("pointermove", handlerPointerMove);
frame.addEventListener("pointerup", handlePointerUp);
frame.addEventListener("pointerleave", handlePointerUp);


renderThumbs(); // Llamar a la función para mostrar las miniaturas
renderHero(currentIndex); // Mostrar la imagen inicial