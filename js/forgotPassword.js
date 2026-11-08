// email form at sample reset confirmation
const resetForm = document.getElementById("reset-form");
const emailInput = document.getElementById("reset-email");
const requestSection = document.getElementById("reset-request");
const successSection = document.getElementById("reset-success");
const sentEmail = document.getElementById("sent-email");
const anotherEmailButton = document.getElementById("try-another-email");

// ipakita ang reset confirmation kapag valid ang email
resetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // browser muna ang mag-check ng required at email
    // sample confirmation lang ito, walang totoong email
    sentEmail.textContent = emailInput.value.trim();

    requestSection.hidden = true;
    successSection.hidden = false;

    document.getElementById("success-heading").focus();
});

// bumalik sa email form
anotherEmailButton.addEventListener("click", () => {
    resetForm.reset();

    successSection.hidden = true;
    requestSection.hidden = false;
    sentEmail.textContent = "";

    emailInput.focus();
});