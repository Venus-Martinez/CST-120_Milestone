/*
* File: site.js
* Purpose: Adds shared interactive behavior across the website
* Author: Venus Martinez
*/

/* ---------- Reusable helper functions ---------- */

document.addEventListener("DOMContentLoaded", () => {
    const lang = getSavedLanguage() || "en";
    applyTranslations(lang);
    setupLanguageSelector();

    if (document.body.classList.contains("page-photos")) {
        setupPhotosPage();
    }

    if (document.body.classList.contains("page-about")) {
        setupAboutPage();
    }
});

function addListener(element, eventName, handler) {
    if (element) {
        element.addEventListener(eventName, handler);
    }
}

function byId(id) {
    return document.getElementById(id);
}

function showInlineMessage(elementId, message) {
    const box = byId(elementId);
    if (!box) return;

    box.textContent = message;
    box.classList.remove("d-none");
}

/* ---------- Page setups ---------- */

function setupAboutPage() {
    const aboutImg = byId("about-me-img");
    const aboutMessage = byId("about-message");
    addListener(aboutImg, "mouseenter", function () {
        if (aboutMessage) {
            aboutMessage.textContent = "This photo was included as part of my personal portfolio introduction.";
        }
    });
    addListener(aboutImg, "mouseleave", function () {
        if (aboutMessage) {
            aboutMessage.textContent = "Hover over the photo to learn more.";
        }
    });
}

function setupPhotosPage() {
    const photoImages = document.querySelectorAll("#photoCarouselSection img[data-message]");
    photoImages.forEach((img) => {
        addListener(img, "click", function () {
            const message = img.dataset.message;
            showInlineMessage("photoMessage", message || "Photo selected.");
        });
    });
}

/* ------ For Language Selection ------ */

const STORAGE_KEY = "language";

function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
}

function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const value = translations?.[lang]?.[key];

        if (value) el.textContent = value;
    });
}

function getSavedLanguage() {
    return localStorage.getItem(STORAGE_KEY);
}

function setupLanguageSelector() {
    const select = document.querySelector("#languageSelect");
    const lang = getSavedLanguage() || "en";

    if (!select) return;

    select.value = lang;
    select.addEventListener("change", (e) => {
        setLanguage(e.target.value);
    });
}