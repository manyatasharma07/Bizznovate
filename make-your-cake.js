
const DAILY_CAPACITY = 10;
const BOOKINGS_KEY = "mmcDailyBookings";

// Replace this with the bakery's WhatsApp number.
// Use country code + number, without +, spaces, or hyphens.
const BAKERY_WHATSAPP_NUMBER = "91YOURNUMBER";

const form = document.getElementById("cakeForm");
const dateInput = document.getElementById("preferredDate");
const availabilityCard = document.getElementById("availabilityCard");
const availabilityTitle = document.getElementById("availabilityTitle");
const availabilityMessage = document.getElementById("availabilityMessage");
const availabilityDot = document.getElementById("availabilityDot");
const suggestedDateButton = document.getElementById("useSuggestedDate");
const deliveryOption = document.getElementById("deliveryOption");
const addressGroup = document.getElementById("addressGroup");
const deliveryAddress = document.getElementById("deliveryAddress");
const submitButton = document.getElementById("reviewOrderButton");
const formError = document.getElementById("formError");

let selectedDateIsAvailable = false;

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getBookings() {
    try {
        const saved = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "{}");

        return saved && typeof saved === "object" && !Array.isArray(saved)
            ? saved
            : {};
    } catch {
        return {};
    }
}

function getBookingCount(date) {
    const bookings = getBookings();
    return Array.isArray(bookings[date]) ? bookings[date].length : 0;
}

function isDateAvailable(date) {
    return getBookingCount(date) < DAILY_CAPACITY;
}

function findNextAvailableDate(startDate) {
    const date = new Date(`${startDate}T12:00:00`);

    for (let i = 0; i < 365; i++) {
        date.setDate(date.getDate() + 1);

        const candidate = getLocalDateString(date);

        if (isDateAvailable(candidate)) {
            return candidate;
        }
    }

    return null;
}

function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function updateAvailability() {
    const date = dateInput.value;

    formError.textContent = "";
    suggestedDateButton.hidden = true;
    selectedDateIsAvailable = false;
    submitButton.disabled = false;

    availabilityCard.classList.remove("available", "full");

    if (!date) {
        availabilityTitle.textContent = "Check your preferred date";
        availabilityMessage.textContent =
            "Select a date to see the available order slots.";
        availabilityDot.style.background = "#b5a9a3";
        return;
    }

    if (date < getLocalDateString()) {
        availabilityTitle.textContent = "Choose a future date";
        availabilityMessage.textContent =
            "Past dates cannot be selected for a new order.";
        availabilityDot.style.background = "#b33d43";
        submitButton.disabled = true;
        return;
    }

    const count = getBookingCount(date);
    const remaining = Math.max(0, DAILY_CAPACITY - count);

    if (remaining > 0) {
        selectedDateIsAvailable = true;
        availabilityCard.classList.add("available");
        availabilityTitle.textContent = "Date appears available!";
        availabilityMessage.textContent =
            `${remaining} of ${DAILY_CAPACITY} demo order slots remain for ${formatDate(date)}. ` +
            "The bakery must still confirm your request.";
        availabilityDot.style.background = "#26794c";
        return;
    }

    availabilityCard.classList.add("full");
    availabilityTitle.textContent = "This date is fully booked";
    availabilityMessage.textContent =
        `The demo limit of ${DAILY_CAPACITY} orders has been reached for ${formatDate(date)}.`;

    availabilityDot.style.background = "#b33d43";

    const nextDate = findNextAvailableDate(date);

    if (nextDate) {
        availabilityMessage.textContent +=
            ` The next available demo date is ${formatDate(nextDate)}.`;

        suggestedDateButton.textContent = `Choose ${formatDate(nextDate)}`;
        suggestedDateButton.dataset.date = nextDate;
        suggestedDateButton.hidden = false;
    } else {
        availabilityMessage.textContent +=
            " No available date was found in the next year.";
        submitButton.disabled = true;
    }
}

function updateDeliveryFields() {
    const deliveryRequired = deliveryOption.value === "Home delivery";

    addressGroup.hidden = !deliveryRequired;
    deliveryAddress.required = deliveryRequired;

    if (!deliveryRequired) {
        deliveryAddress.value = "";
    }
}

function reserveDemoSlot(date, bookingId) {
    const bookings = getBookings();

    if (!Array.isArray(bookings[date])) {
        bookings[date] = [];
    }

    if (bookings[date].length >= DAILY_CAPACITY) {
        return false;
    }

    bookings[date].push(bookingId);

    try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        return true;
    } catch {
        formError.textContent =
            "Your browser could not save the demo booking. Please check your browser storage and try again.";
        return false;
    }
}

function releaseDemoSlot(date, bookingId) {
    const bookings = getBookings();

    if (!Array.isArray(bookings[date])) {
        return;
    }

    bookings[date] = bookings[date].filter(id => id !== bookingId);

    if (bookings[date].length === 0) {
        delete bookings[date];
    }

    try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
        // The demo reservation may remain saved if storage is unavailable.
    }
}

dateInput.min = getLocalDateString();

dateInput.addEventListener("change", updateAvailability);
deliveryOption.addEventListener("change", updateDeliveryFields);

suggestedDateButton.addEventListener("click", function () {
    if (!this.dataset.date) {
        return;
    }

    dateInput.value = this.dataset.date;
    updateAvailability();
    dateInput.focus();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    formError.textContent = "";
    updateAvailability();

    if (!form.reportValidity()) {
        return;
    }

    if (!selectedDateIsAvailable) {
        formError.textContent =
            "Please select an available date before submitting your order.";
        return;
    }

    if (!/^[6-9]\d{9}$/.test(
        document.getElementById("customerPhone").value.trim()
    )) {
        formError.textContent =
            "Please enter a valid 10-digit Indian mobile number.";
        return;
    }

    if (
        !/^\d{10,15}$/.test(BAKERY_WHATSAPP_NUMBER) ||
        BAKERY_WHATSAPP_NUMBER === "91YOURNUMBER"
    ) {
        formError.textContent =
            "Please add the bakery's WhatsApp number in customizer.js first.";
        return;
    }

    const order = {
        customerName: document.getElementById("customerName").value.trim(),
        customerPhone: document.getElementById("customerPhone").value.trim(),
        category: document.getElementById("cakeCategory").value,
        flavor: document.getElementById("cakeFlavor").value,
        size: document.getElementById("cakeSize").value,
        occasion: document.getElementById("occasion").value || "Not specified",
        cakeMessage: document.getElementById("cakeMessage").value.trim() || "Not specified",
        designNotes: document.getElementById("designNotes").value.trim() || "Not specified",
        date: dateInput.value,
        time: document.getElementById("preferredTime").value,
        delivery: deliveryOption.value,
        address: deliveryOption.value === "Home delivery"
            ? deliveryAddress.value.trim()
            : "Store pickup"
    };

    if (order.delivery === "Home delivery" && !order.address) {
        formError.textContent = "Please enter your delivery address.";
        deliveryAddress.focus();
        return;
    }

    const bookingId = `MMC-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // Reserve a temporary slot in this browser's demo booking list.
    // A real booking system must reserve slots on a server.
    if (!reserveDemoSlot(order.date, bookingId)) {
        updateAvailability();
        formError.textContent =
            "This date may have just filled up. Please choose another date.";
        return;
    }

    const message = [
        "🎂 *NEW CAKE ORDER - MAKE MY CAKE*",
        "",
        `*Order reference:* ${bookingId}`,
        `*Customer:* ${order.customerName}`,
        `*Mobile:* ${order.customerPhone}`,
        "",
        "*CAKE DETAILS*",
        `*Category:* ${order.category}`,
        `*Flavour:* ${order.flavor}`,
        `*Size:* ${order.size}`,
        `*Occasion:* ${order.occasion}`,
        `*Message on cake:* ${order.cakeMessage}`,
        `*Design details:* ${order.designNotes}`,
        "",
        "*ORDER PREFERENCE*",
        `*Preferred date:* ${formatDate(order.date)}`,
        `*Preferred time:* ${order.time}`,
        `*Pickup/delivery:* ${order.delivery}`,
        `*Address:* ${order.address}`,
        "",
        "Please confirm availability and final price. This is a request, not a confirmed order."
    ].join("\n");

    const whatsappURL =
        `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp directly from the submit interaction.
    const whatsappWindow = window.open(whatsappURL, "_blank");

    if (!whatsappWindow) {
        // Undo the demo slot if the browser blocks the WhatsApp window.
        releaseDemoSlot(order.date, bookingId);
        formError.textContent =
            "WhatsApp could not open. Allow pop-ups for this site and try again.";
        updateAvailability();
        return;
    }

    updateAvailability();
});

updateDeliveryFields();
updateAvailability();
