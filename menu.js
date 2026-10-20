
const searchInput = document.getElementById("menuSearch");
const menuItems = [...document.querySelectorAll(".menu-item")];
const menuCategories = [...document.querySelectorAll(".menu-category")];
const noResults = document.getElementById("noResults");
const categoryLinks = [...document.querySelectorAll(".category-nav a")];

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        menuItems.forEach((item) => {
            const searchableText = (
                item.dataset.name + " " + item.textContent
            ).toLowerCase();

            const matches = searchableText.includes(query);

            item.hidden = !matches;

            if (matches) visibleCount++;
        });

        menuCategories.forEach((section) => {
            const hasVisibleItems = [...section.querySelectorAll(".menu-item")]
                .some((item) => !item.hidden);

            section.hidden = !hasVisibleItems;
        });

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    });
}

categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
        categoryLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
    });
});

const sections = document.querySelectorAll(".menu-category");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            categoryLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    }, {
        rootMargin: "-20% 0px -65% 0px"
    });

    sections.forEach((section) => observer.observe(section));
}
