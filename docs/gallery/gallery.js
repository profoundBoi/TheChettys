
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery-grid img");
  let currentIndex = 0;

  // Lightbox container
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  document.body.appendChild(lightbox);

  const img = document.createElement("img");
  lightbox.appendChild(img);

  // Arrows
  const prev = document.createElement("div");
  prev.className = "lightbox-arrow prev";
  prev.innerHTML = "&#10094;"; // Left arrow
  lightbox.appendChild(prev);

  const next = document.createElement("div");
  next.className = "lightbox-arrow next";
  next.innerHTML = "&#10095;"; // Right arrow
  lightbox.appendChild(next);

  function showImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;
    img.src = images[currentIndex].src;
    img.alt = images[currentIndex].alt;
  }

  // Open lightbox
  images.forEach((image, index) => {
    image.addEventListener("click", () => {
      lightbox.classList.add("active");
      showImage(index);
    });
  });

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  // Navigation arrows
  prev.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  next.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") lightbox.classList.remove("active");
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  // Swipe navigation for mobile
  let startX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  lightbox.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      // swipe left → next
      showImage(currentIndex + 1);
    } else if (endX - startX > 50) {
      // swipe right → prev
      showImage(currentIndex - 1);
    }
  });
});
