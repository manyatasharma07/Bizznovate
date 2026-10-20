
const CONTACT_CONFIG = {
    whatsappNumber: "917742191452",
    phoneNumber: "916261619947",
    address: "644, Narendra Tiwari Marg, near Dosa Crush, Usha Nagar, Indore, Madhya Pradesh 452009",
    openingHours: "Please contact us for current opening hours"
};

function configureContactDetails() {
    const phoneLink = document.getElementById("phoneLink");
    const phoneText = document.getElementById("phoneText");
    const whatsappLink = document.getElementById("whatsappLink");
    const addressText = document.getElementById("addressText");
    const hoursText = document.getElementById("hoursText");
    const mapAddress = document.getElementById("mapAddress");
    const mapLink = document.getElementById("mapLink");

    const hasPhone =
        CONTACT_CONFIG.phoneNumber !== "YOUR_PHONE_NUMBER";

    const hasWhatsApp =
        CONTACT_CONFIG.whatsappNumber !== "91YOURNUMBER";

    if (phoneText) {
        phoneText.textContent = hasPhone
            ? CONTACT_CONFIG.phoneNumber
            : "Contact number coming soon";
    }

    if (phoneLink) {
        phoneLink.href = hasPhone
            ? `tel:${CONTACT_CONFIG.phoneNumber}`
            : "#";
    }

    if (whatsappLink) {
        whatsappLink.href = hasWhatsApp
            ? `https://wa.me/${CONTACT_CONFIG.whatsappNumber}`
            : "#";

        if (!hasWhatsApp) {
            whatsappLink.addEventListener("click", function (event) {
                event.preventDefault();
                alert("Our WhatsApp number will be available soon.");
            });
        }
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
        mapLink.href =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(CONTACT_CONFIG.address);

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

        if (
            CONTACT_CONFIG.whatsappNumber === "91YOURNUMBER" ||
            !/^\d{10,15}$/.test(CONTACT_CONFIG.whatsappNumber)
        ) {
            if (contactError) {
                contactError.textContent =
                    "The bakery's WhatsApp number has not been configured yet.";
            } else {
                alert("The bakery's WhatsApp number has not been configured yet.");
            }
            return;
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
