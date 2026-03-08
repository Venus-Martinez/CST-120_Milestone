/*
* File: site.js
* Purpose: Adds reusable interactivity across website pages. (Milestone 4)
* Author: Venus Martinez
* Features:
*    - Photos page: click an image to show a pop up message
*    - About page: hover over my photo to change the message text
*/

/* ---------- Reusable helper functions (shared across pages) ---------- */

// Ensures JavaScript runs only after the page content has finished loading
function onReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}

// Adds an event listener only when the element exists (this prevents errors on other pages)
function addListener(element, eventName, handler) {
    if (element) {
        element.addEventListener(eventName, handler);
    }
}

// Helper function I use to select an element by id
function byId(id) {
    return document.getElementById(id);
}

// Shows the click message as a browser pop up
function showPopup(message) {
    alert(message);
}

/* ---------- Page setups (only ran on the correct page) ---------- */

function setupAboutPage() {
    // Target the About page image for hover effects
    const aboutImg = byId("about-me-img");
    const aboutMessage = byId("about-message");

    // On hover, change the message text
    addListener(aboutImg, "mouseenter", function () {
        if (aboutMessage) {
            aboutMessage.textContent = "Ahh! Careful! That cursor will poke my eye out!";
        }
    });

    // When the cursor leaves the image, reset the message
    addListener(aboutImg, "mouseleave", function () {
        if (aboutMessage) {
            aboutMessage.textContent = "Hover over my photo to see a message.";
        }
    });
}

function setupPhotosPage() {
    // Select all photos that contain a custom popup message
    const photoImages = document.querySelectorAll("#photoGridSection img[data-message]");

    // Add a click event to every image in the gallery
    photoImages.forEach((img) => {
        addListener(img, "click", function () {
            /*
              Each image has a data-message attribute.
              Example: data-message="Go Bills!"
            */
            const message = img.dataset.message;

            // Use the image's custom message, or a default message if one is missing
            showPopup(message || "Photo clicked!");
        });
    });
}

/* ---------- Page detection: this ensures only the code needed for the current page runs ---------- */

onReady(function () {
    /*
      Detect which page is currently loaded using the body class.
      This allows one shared JavaScript file to run page specific behavior.
    */
    if (document.body.classList.contains("page-photos")) {
        setupPhotosPage();
    }

    if (document.body.classList.contains("page-about")) {
        setupAboutPage();
    }
});

/* ---------- Milestone 6: jQuery show/hide features ---------- */

/*
  Bootstrap 5 does not require jQuery, but the Milestone 6 instructions require using jQuery.
  The code below uses jQuery to hide and show content on multiple pages.
  Each handler checks for an element by id, so it will only run on the pages where that element exists.
*/

function setupJQueryToggles() {
    // If jQuery is not loaded for some reason, skip this setup to avoid errors
    if (!window.jQuery) return;

    // jQuery shorthand for DOM ready
    $(function () {
        // Hobbies page: hide and show the bouncing ball animation
        $("#toggle-ball, #toggle-ball2").on("click", function () {
            $("#ball").fadeToggle(150);
        });

        // Hobbies page: hide and show the media section (videos/audio)
        $("#toggle-media").on("click", function () {
            $("#mediaSection").slideToggle(200);
        });

        // Photos page: hide and show the photo gallery section
        $("#toggle-photo-grid").on("click", function () {
            $("#photoGridSection").slideToggle(200, function () {
                const galleryVisible = $("#photoGridSection").is(":visible");

                // IMPORTANT: clear any old inline display style left by .toggle() / .hide()
                $("#photoHiddenMessage").removeAttr("style");

                // Show message only when gallery is hidden
                $("#photoHiddenMessage").toggleClass("d-none", galleryVisible);

                $("#toggle-photo-grid").text(
                    galleryVisible ? "Hide Photo Gallery" : "Show Photo Gallery"
                );
            });
        });
    });
}

// Run the Milestone 6 jQuery setup after the page loads

onReady(function () {
    setupJQueryToggles();
});


/* ------ For Language Selection ------ */

const STORAGE_KEY = "language"; // Key used for storing the selected language in local storage

// This sets the language as specified in the i18n.js file.
function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang); // Save the selected language in local storage
    applyTranslations(lang); // Apply the translations to the page
}

// This function applies the translations to the page based on the selected language.
function applyTranslations(lang) {
    document.documentElement.lang = lang; // Set the lang attribute on the HTML element for accessibility

    // Loop through all elements with a data-i18n attribute and update their text content based on the translations object

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const value = translations?.[lang]?.[key];

        if (value) el.textContent = value;
    });
}

// This function retrieves the saved language from local storage, allowing the website to remember the user's choice across sessions.
function getSavedLanguage() {
    return localStorage.getItem(STORAGE_KEY);
}

/* 
* When the page loads, check for a saved language and apply it if found. 
* This ensures that the user's language preference is maintained even after refreshing or navigating to a different page.
* Additionally, it updates the language selection dropdown to reflect the saved language, providing a consistent user experience.
*/
document.addEventListener("DOMContentLoaded", () => {
    const select = document.querySelector("#languageSelect");
    const lang = getSavedLanguage() || "en"; // Default to English if no language is saved

    applyTranslations(lang); // Apply the saved language translations to the page

    if (select) {
        select.value = lang; // Set the dropdown to the saved language
        select.addEventListener("change", (e) => {
            setLanguage(e.target.value); // Update the language when the user selects a new option
        });
    }
});