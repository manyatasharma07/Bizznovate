const CONTACT_CONFIG = {
    whatsappNumber: "917742191452",
    phoneNumber: "916261619947",
    address: "644, Narendra Tiwari Marg, near Dosa Crush, Usha Nagar, Indore, Madhya Pradesh 452009",
    openingHours: "Please contact us for current opening hours",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Make+My+Cake%2C+642+Narendra+Tiwari+Marg%2C+Sudama+Nagar%2C+Indore"
};

function configureContactDetails() {
    const phoneLink = document.getElementById("phoneLink");
    const phoneText = document.getElementById("phoneText");
    const whatsappLink = document.getElementById("whatsappLink");
    const addressText = document.getElementById("addressText");
    const hoursText = document.getElementById("hoursText");
    const mapAddress = document.getElementById("mapAddress");
    const mapLink = document.getElementById("mapLink");

    if (phoneText) {
        phoneText.textContent = CONTACT_CONFIG.phoneNumber;
    }

    if (phoneLink) {
        phoneLink.href = `tel:${CONTACT_CONFIG.phoneNumber}`;
    }

    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}`;
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";
    }

    if (addressText) {
        addressText.textContent = CONTACT_CONFIG.address;
    }

    if (hoursText) {
        hoursText.textContent = CONTACT_CONFIG.openingHours;
    }

    if (mapAddress) {
        mapAddress.textContent = CONTACT_CONFIG.address;
    }

    if (mapLink) {
        mapLink.href = CONTACT_CONFIG.mapLink;
        mapLink.target = "_blank";
        mapLink.rel = "noopener noreferrer";
    }
}

function setupContactForm() {
    const contactForm = document.getElementById("contactForm");
    const contactError = document.getElementById("contactError");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (contactError) {
            contactError.textContent = "";
        }

        const name = document.getElementById("name")?.value.trim() || "";
        const mobile = document.getElementById("mobile")?.value.trim() || "";
        const enquiryType =
            document.getElementById("enquiryType")?.value || "General enquiry";
        const message = document.getElementById("message")?.value.trim() || "";

        if (!name || !mobile || !message) {
            if (contactError) {
                contactError.textContent =
                    "Please fill in your name, mobile number, and message.";
            }
            return;
        }

        if (!/^[0-9+\-\s()]{10,18}$/.test(mobile)) {
            if (contactError) {
                contactError.textContent =
                    "Please enter a valid mobile number.";
            }
            return;
        }

        const whatsappMessage = [
            "Hello Make My Cake!",
            "",
            "I have a new enquiry from your website.",
            "",
            `Name: ${name}`,
            `Mobile: ${mobile}`,
            `Enquiry type: ${enquiryType}`,
            `Message: ${message}`
        ].join("\n");

        const whatsappURL =
            `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=` +
            encodeURIComponent(whatsappMessage);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    configureContactDetails();
    setupContactForm();
});
