// shortlist, hire, at bilang ng applicants
const applicantTable = document.querySelector(
    ".applicants-table-card tbody"
);

const actionButtons = applicantTable.querySelectorAll(
    ".shortlist-button, .hire-button"
);

// bilangin ang applicants ayon sa status
const updateApplicantCounts = () => {
    const rows = applicantTable.querySelectorAll("tr");

    let newCount = 0;
    let shortlistedCount = 0;
    let hiredCount = 0;

    rows.forEach((row) => {
        const status = row.querySelector(".applicant-status")
            .textContent.trim();

        if (status === "New") {
            newCount++;
        } else if (status === "Shortlisted") {
            shortlistedCount++;
        } else if (status === "Hired") {
            hiredCount++;
        }
    });

    document.getElementById("total-applicants").textContent =
        rows.length;

    document.getElementById("new-applicants").textContent =
        newCount;

    document.getElementById("shortlisted-applicants").textContent =
        shortlistedCount;

    document.getElementById("hired-applicants").textContent =
        hiredCount;

    document.getElementById("applicant-count").textContent =
        `${rows.length} Applicants`;
};

const hireDialog = document.getElementById("hire-dialog");
const hireApplicantName = document.getElementById("hire-applicant-name");

let pendingHireButton = null;

// i-shortlist ang applicant o buksan ang hire popup
actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("tr");
        const status = row.querySelector(".applicant-status");

        if (button.classList.contains("shortlist-button")) {
            status.textContent = "Shortlisted";
            status.className = "applicant-status status-shortlisted";

            button.textContent = "Hire";
            button.className = "hire-button";

            updateApplicantCounts();
        } else {
            pendingHireButton = button;

            hireApplicantName.textContent = row
                .querySelector(".table-applicant strong")
                .textContent.trim();

            hireDialog.returnValue = "";
            hireDialog.showModal();
        }
    });
});

// gawing hired kapag nag-confirm
hireDialog.addEventListener("close", () => {
    if (
        hireDialog.returnValue === "confirm"
        && pendingHireButton !== null
    ) {
        const row = pendingHireButton.closest("tr");
        const status = row.querySelector(".applicant-status");

        status.textContent = "Hired";
        status.className = "applicant-status status-hired";

        pendingHireButton.remove();
        updateApplicantCounts();

        row.querySelector(".view-button").focus();
    }

    pendingHireButton = null;
});

// ipakita ang unang bilang sa summary
updateApplicantCounts();