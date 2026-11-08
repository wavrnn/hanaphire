// show at hide ng password
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");
const eyeImage = togglePassword.querySelector("img");

// palitan ang visibility at eye icon ng password
togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    if (isHidden) {
        passwordInput.type = "text";
        eyeImage.src = "asset/images/icons/eye-off-gray.svg";

        togglePassword.setAttribute("aria-label", "Hide password");
        togglePassword.setAttribute("aria-pressed", "true");
    } else {
        passwordInput.type = "password";
        eyeImage.src = "asset/images/icons/eye-gray.svg";

        togglePassword.setAttribute("aria-label", "Show password");
        togglePassword.setAttribute("aria-pressed", "false");
    }
});