// pili ng registration page ayon sa account
const accountForm = document.querySelector(".account-form");

// pumunta sa form ng napiling account
accountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedAccount = accountForm.querySelector(
        'input[name="accounttype"]:checked'
    );

    if (!selectedAccount) {
        return;
    }

    if (selectedAccount.value === "Job Seeker") {
        window.location.href = "registerJobSeeker.html";
    } else if (selectedAccount.value === "Employer") {
        window.location.href = "registerEmployer.html";
    }
});