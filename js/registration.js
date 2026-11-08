// show at hide ng password at check kung magkapareho
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmpassword");
const eyeButtons = document.querySelectorAll("button.eye-icon");

// lagyan ng click event ang bawat eye button
eyeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const fieldId = button.getAttribute("aria-controls");
        const field = document.getElementById(fieldId);
        const isHidden = field.type === "password";
        const eyeImage = button.querySelector("img");
        const fieldName = fieldId === "password"
            ? "password"
            : "confirmation password";

        if (isHidden) {
            field.type = "text";
            eyeImage.src = "asset/images/icons/eye-off-gray.svg";

            button.setAttribute("aria-label", `Hide ${fieldName}`);
            button.setAttribute("aria-pressed", "true");
        } else {
            field.type = "password";
            eyeImage.src = "asset/images/icons/eye-gray.svg";

            button.setAttribute("aria-label", `Show ${fieldName}`);
            button.setAttribute("aria-pressed", "false");
        }
    });
});

// check ulit kapag nagbago ang alinmang password
const checkPasswords = () => {
    let errorMessage = "";

    if (confirmPasswordInput.value !== passwordInput.value) {
        errorMessage = "Your passwords do not match.";
    }

    confirmPasswordInput.setCustomValidity(errorMessage);
};

passwordInput.addEventListener("input", checkPasswords);
confirmPasswordInput.addEventListener("input", checkPasswords);