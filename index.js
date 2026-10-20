
document.addEventListener("DOMContentLoaded", () => {
    const slides = Array.from(document.querySelectorAll(".slide"));
    const dots = Array.from(document.querySelectorAll(".slide-dot"));
    const previousButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");
    const caption = document.getElementById("slideCaption");
    const counter = document.getElementById("slideCounter");
    const slideshow = document.querySelector(".slideshow");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    const captions = [
        "A peek inside our bakery",
        "A little sweetness at the counter",
        "Cakes ready for special moments",
        "Little details that make us smile"
    ];

    let currentSlide = 0;
    let slideshowTimer;

    function showSlide(index) {
        if (!slides.length) return;

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentSlide);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
            dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
        });

        if (caption) {
            caption.textContent = captions[currentSlide] || "A little sweetness";
        }

        if (counter) {
            counter.textContent =
                `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
    }

    function startSlideshow() {
        clearInterval(slideshowTimer);

        if (slides.length > 1) {
            slideshowTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }
    }

    if (slides.length) {
        showSlide(0);
        startSlideshow();

        previousButton?.addEventListener("click", () => {
            showSlide(currentSlide - 1);
            startSlideshow();
        });

        nextButton?.addEventListener("click", () => {
            showSlide(currentSlide + 1);
            startSlideshow();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                startSlideshow();
            });
        });

        slideshow?.addEventListener("mouseenter", () => {
            clearInterval(slideshowTimer);
        });

        slideshow?.addEventListener("mouseleave", startSlideshow);

        slideshow?.addEventListener("focusin", () => {
            clearInterval(slideshowTimer);
        });

        slideshow?.addEventListener("focusout", startSlideshow);
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
            if (menuToggle) menuToggle.textContent = "☰";
        });
    });

    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
});
