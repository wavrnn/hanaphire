// bilang ng message, check ng form, at mga popup
const contactForm = document.querySelector(".contact-form");
const messageInput = document.getElementById("message");
const messageCount = document.getElementById("message-count");
const clearButton = document.getElementById("clear-form");

// bilangin ang characters sa message
const updateMessageCount = () => {
    const used = messageInput.value.length;
    const limit = messageInput.maxLength;

    messageCount.textContent = `${used} / ${limit} characters`;
};

// update habang nagta-type o nagbabago ang text
messageInput.addEventListener("input", updateMessageCount);

// ipakita ang unang bilang
updateMessageCount();

// magtanong muna bago burahin ang form
const clearDialog = document.getElementById("clear-dialog");

// buksan ang confirmation popup
clearButton.addEventListener("click", () => {
    clearDialog.returnValue = "";
    clearDialog.showModal();
});

// burahin lang kapag nag-confirm
clearDialog.addEventListener("close", () => {
    if (clearDialog.returnValue === "clear") {
        contactForm.reset();
        updateMessageCount();
        document.getElementById("fullname").focus();
    }
});

const contactFields = contactForm.querySelectorAll("input, textarea");
let contactSubmitted = false;

// maglagay ng error message sa ilalim ng field
contactFields.forEach((field) => {
    const error = document.createElement("p");

    error.id = `${field.id}-error`;
    error.className = "contact-error";
    error.hidden = true;
    field.after(error);

    // panatilihin ang dating description at character counter
    const description = field.getAttribute("aria-describedby") || "";

    field.setAttribute(
        "aria-describedby",
        `${description} ${error.id}`.trim()
    );
});

// gumawa ng lalagyan ng result message
const contactResult = document.createElement("p");
contactResult.setAttribute("role", "status");
contactForm.appendChild(contactResult);

// check kung may laman at tama ang field
const validateContactField = (field) => {
    let message = "";

    if (field.required && field.value.trim() === "") {
        message = "Please complete this field.";
    } else if (field.validity.typeMismatch) {
        message = "Please enter a valid email address.";
    } else if (!field.validity.valid) {
        message = field.validationMessage;
    }

    const error = document.getElementById(`${field.id}-error`);

    error.textContent = message;
    error.hidden = message === "";
    field.setAttribute("aria-invalid", String(message !== ""));

    return message === "";
};

// ipakita ang errors o success popup
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactSubmitted = true;
    contactResult.textContent = "";

    let firstInvalidField = null;

    contactFields.forEach((field) => {
        const isValid = validateContactField(field);

        if (!isValid && firstInvalidField === null) {
            firstInvalidField = field;
        }
    });

    if (firstInvalidField !== null) {
        firstInvalidField.focus();
    } else {
        contactResult.textContent = "";

        messageSender.textContent = document
            .getElementById("fullname").value.trim();

        messageSuccess.showModal();
    }
});

// update ang errors habang inaayos ang sagot
contactFields.forEach((field) => {
    field.addEventListener("input", () => {
        contactResult.textContent = "";

        if (contactSubmitted) {
            validateContactField(field);
        }
    });
});

// tanggalin ang errors kapag ni-clear ang form
contactForm.addEventListener("reset", () => {
    contactSubmitted = false;
    contactResult.textContent = "";

    contactFields.forEach((field) => {
        const error = document.getElementById(`${field.id}-error`);

        error.textContent = "";
        error.hidden = true;
        field.removeAttribute("aria-invalid");
    });
});

// sa ilalim ng fields ipakita ang errors
contactForm.noValidate = true;

const messageSuccess = document.getElementById("message-success");
const messageSender = document.getElementById("message-sender");
const closeMessageSuccess = document.getElementById(
    "close-message-success"
);

// isara ang success popup
closeMessageSuccess.addEventListener("click", () => {
    messageSuccess.close();
});