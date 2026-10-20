
const CONTACT_CONFIG = {
    // Replace these placeholders with your real bakery details.
    whatsappNumber: "91YOURNUMBER",
    phoneNumber: "YOUR_PHONE_NUMBER",
    address: "YOUR_BAKERY_ADDRESS",
    openingHours: "YOUR_OPENING_HOURS"
};

const phoneLink = document.getElementById("phoneLink");
const phoneText = document.getElementById("phoneText");
const whatsappLink = document.getElementById("whatsappLink");
const addressText = document.getElementById("addressText");
const hoursText = document.getElementById("hoursText");
const mapAddress = document.getElementById("mapAddress");
const mapLink = document.getElementById("mapLink");
const contactForm = document.getElementById("contactForm");
const contactError = document.getElementById("contactError");

function isPlaceholder(value) {
    return !value || value.includes("YOUR_");
}

function cleanPhoneNumber(value) {
    return value.replace(/\D/g, "");
}

function configureContactDetails() {
    if (!isPlaceholder(CONTACT_CONFIG.phoneNumber)) {
        const phone = cleanPhoneNumber(CONTACT_CONFIG.phoneNumber);

        phoneText.textContent = CONTACT_CONFIG.phoneNumber;
        phoneLink.href = `tel:${phone}`;
    } else {
        phoneText.textContent = "Phone number to be added";
        phoneLink.removeAttribute("href");
    }

    if (!isPlaceholder(CONTACT_CONFIG.whatsappNumber)) {
        const whatsapp = cleanPhoneNumber(CONTACT_CONFIG.whatsappNumber);

        whatsappLink.href =
            `https://wa.me/${whatsapp}?text=${encodeURIComponent(
                "Hello Make My Cake! I have an enquiry."
            )}`;
    } else {
        whatsappLink.removeAttribute("href");
    }

    addressText.textContent = isPlaceholder(CONTACT_CONFIG.address)
        ? "Bakery address to be added"
        : CONTACT_CONFIG.address;

    hoursText.textContent = isPlaceholder(CONTACT_CONFIG.openingHours)
        ? "Opening hours to be added"
        : CONTACT_CONFIG.openingHours;

    if (!isPlaceholder(CONTACT_CONFIG.address)) {
        mapAddress.textContent = CONTACT_CONFIG.address;

        mapLink.href =
            `https://www.google.com/maps/search/?api=1&query=${
                encodeURIComponent(CONTACT_CONFIG.address)
            }`;

        mapLink.hidden = false;
    } else {
        mapAddress.textContent =
            "Add the complete bakery address in contact.js to enable Google Maps.";
        mapLink.hidden = true;
    }
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    contactError.textContent = "";

    if (!contactForm.reportValidity()) {
        return;
    }

    const whatsappNumber = cleanPhoneNumber(
        CONTACT_CONFIG.whatsappNumber
    );

    if (
        isPlaceholder(CONTACT_CONFIG.whatsappNumber) ||
        !/^\d{10,15}$/.test(whatsappNumber)
    ) {
        contactError.textContent =
            "Please add the bakery's WhatsApp number in contact.js before sending an enquiry.";
        return;
    }

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const enquiryType = document.getElementById("enquiryType").value;
    const message = document.getElementById("message").value.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        contactError.textContent =
            "Please enter a valid 10-digit Indian mobile number.";
        return;
    }

    const whatsappMessage = [
        "🍰 *MAKE MY CAKE — NEW ENQUIRY*",
        "",
        `*Name:* ${name}`,
        `*Customer mobile:* ${mobile}`,
        `*Enquiry type:* ${enquiryType}`,
        "",
        "*Message:*",
        message,
        "",
        "Thank you!"
    ].join("\n");

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${
            encodeURIComponent(whatsappMessage)
        }`;

    window.open(whatsappURL, "_blank");
});

configureContactDetails();
