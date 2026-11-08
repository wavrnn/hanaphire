// check ng registration fields at error messages
const registrationForm = document.querySelector(
    ".registration-form, .employer-registration-form"
);

const registrationFields = registrationForm.querySelectorAll(
    "input, select"
);

let hasSubmitted = false;

// gumawa ng error message sa ilalim ng input
registrationFields.forEach((field) => {
    const error = document.createElement("p");

    error.id = `${field.id}-error`;
    error.className = "field-error";
    error.hidden = true;

    const inputContainer = field.closest(
        ".registration-input, .employer-input"
    );

    if (inputContainer) {
        inputContainer.after(error);
    } else {
        // direkta sa ilalim ng dropdown ang error message
        field.after(error);
    }

    field.setAttribute("aria-describedby", error.id);
});

// gumawa ng lalagyan ng result ng form
const formMessage = document.createElement("p");
formMessage.setAttribute("role", "status");
registrationForm.appendChild(formMessage);

// check ang required, email, password, at ibang field rules
const validateField = (field) => {
    let message = "";

    const isBlank = field.type === "password"
        ? field.value === ""
        : field.value.trim() === "";

    if (field.required && isBlank) {
        message = "Please complete this field.";
    } else if (field.validity.typeMismatch) {
        message = field.type === "url"
            ? "Please enter a valid website URL, such as https://example.com."
            : "Please enter a valid email address.";
    } else if (
        field.type === "password"
        && field.value.length < field.minLength
    ) {
        message = `Please enter at least ${field.minLength} characters.`;
    } else if (field.validity.customError) {
        // gamitin ang error kapag hindi pareho ang passwords
        message = field.validationMessage;
    } else if (!field.validity.valid) {
        message = field.validationMessage;
    }

    const error = document.getElementById(`${field.id}-error`);

    error.textContent = message;
    error.hidden = message === "";
    field.setAttribute("aria-invalid", String(message !== ""));

    return message === "";
};

// check lahat ng fields bago magpatuloy
registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hasSubmitted = true;
    formMessage.textContent = "";

    // check muna kung pareho ang passwords
    checkPasswords();

    let firstInvalidField = null;

    registrationFields.forEach((field) => {
        const isValid = validateField(field);

        if (!isValid && firstInvalidField === null) {
            firstInvalidField = field;
        }
    });

    if (firstInvalidField !== null) {
        firstInvalidField.focus();
    } else {
        formMessage.textContent =
            "All details passed validation. Demo only—no account was created.";
    }
});

// pagkatapos mag-submit, update ang errors habang nagta-type
registrationFields.forEach((field) => {
    field.addEventListener("input", () => {
        formMessage.textContent = "";

        if (!hasSubmitted) {
            return;
        }

        validateField(field);

        // check din ang confirmation kapag nagbago ang password
        if (field.id === "password") {
            validateField(document.getElementById("confirmpassword"));
        }
    });
});

// gamitin ang errors sa ilalim ng fields
// gamit pa rin ang validation rules ng fields
registrationForm.noValidate = true;

// update ang error kapag nagbago ang dropdown
registrationForm.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
        formMessage.textContent = "";

        if (hasSubmitted) {
            validateField(select);
        }
    });
});