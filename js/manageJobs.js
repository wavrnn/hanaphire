// edit, publish, at filter ng jobs
const jobsTable = document.querySelector(".jobs-table-card tbody");
const editDialog = document.getElementById("edit-job-dialog");
const editForm = document.getElementById("edit-job-form");
const publishDialog = document.getElementById("publish-job-dialog");
const feedback = document.getElementById("jobs-feedback");

const editTitle = document.getElementById("edit-title");
const editLocation = document.getElementById("edit-location");
const editType = document.getElementById("edit-type");
const editSetup = document.getElementById("edit-setup");

let editingRow = null;
let publishingRow = null;

// update ang summary gamit ang rows sa table
const updateJobCounts = () => {
    const rows = jobsTable.querySelectorAll("tr");
    let active = 0;
    let draft = 0;
    let closed = 0;

    rows.forEach((row) => {
        const status = row.querySelector(".job-status").textContent.trim();

        if (status === "Active") active++;
        if (status === "Draft") draft++;
        if (status === "Closed") closed++;
    });

    const counts = document.querySelectorAll(".job-summary-card h2");
    const values = [rows.length, active, draft, closed];

    counts.forEach((heading, index) => {
        heading.textContent = values[index];
    });

    document.querySelector(".jobs-table-heading > span").textContent =
        `${rows.length} Jobs`;
};

// buksan ang edit form na may current job details
jobsTable.querySelectorAll(".job-edit-button").forEach((button) => {
    button.addEventListener("click", () => {
        editingRow = button.closest("tr");

        editTitle.value = editingRow.querySelector(
            ".job-title-cell strong"
        ).textContent.trim();

        editLocation.value = editingRow.querySelector(
            ".job-title-cell span"
        ).textContent.trim();

        editType.value = editingRow.cells[1].textContent.trim();
        editSetup.value = editingRow.cells[2].textContent.trim();

        feedback.textContent = "";
        editDialog.showModal();
        editTitle.focus();
    });
});

// huwag tanggapin ang puro spaces
const validateJobText = () => {
    editTitle.setCustomValidity(
        editTitle.value.trim() ? "" : "Please enter a job title."
    );

    editLocation.setCustomValidity(
        editLocation.value.trim() ? "" : "Please enter a location."
    );
};

editTitle.addEventListener("input", validateJobText);
editLocation.addEventListener("input", validateJobText);

// ilagay sa row ang binagong details
editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateJobText();

    if (!editForm.reportValidity() || editingRow === null) {
        return;
    }

    editingRow.querySelector(".job-title-cell strong").textContent =
        editTitle.value.trim();

    editingRow.querySelector(".job-title-cell span").textContent =
        editLocation.value.trim();

    editingRow.cells[1].textContent = editType.value;
    editingRow.cells[2].textContent = editSetup.value;

    editDialog.close();
    filterJobs();
    feedback.textContent = "Job details updated.";
});

// isara ang edit popup nang walang save
document.getElementById("cancel-job-edit").addEventListener("click", () => {
    editDialog.close();
});

// linisin ang dating edit at errors
editDialog.addEventListener("close", () => {
    editingRow = null;
    editTitle.setCustomValidity("");
    editLocation.setCustomValidity("");
});

// buksan ang publish popup para sa draft
jobsTable.querySelectorAll(".publish-button").forEach((button) => {
    button.addEventListener("click", () => {
        publishingRow = button.closest("tr");

        document.getElementById("job-to-publish").textContent =
            publishingRow.querySelector(
                ".job-title-cell strong"
            ).textContent.trim();

        feedback.textContent = "";
        publishDialog.returnValue = "";
        publishDialog.showModal();
    });
});

// gawing active ang draft kapag nag-confirm
publishDialog.addEventListener("close", () => {
    if (
        publishDialog.returnValue === "publish"
        && publishingRow !== null
    ) {
        const status = publishingRow.querySelector(".job-status");

        status.textContent = "Active";
        status.className = "job-status status-active";

        publishingRow.cells[4].textContent = new Date().toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

        const applicantsLink = document.createElement("a");
        applicantsLink.href = "manageApplicants.html";
        applicantsLink.className = "applicant-count";
        applicantsLink.textContent = "0 Applicants";

        publishingRow.cells[3].replaceChildren(applicantsLink);

        const publishButton = publishingRow.querySelector(".publish-button");
        publishButton.remove();

        updateJobCounts();
        filterJobs();

        feedback.textContent = "Job status updated to Active.";

        // puwedeng maitago ang row kung draft ang filter
        if (publishingRow.hidden) {
            jobStatusInput.focus();
        } else {
            publishingRow.querySelector(".job-edit-button").focus();
        }
    }

    publishingRow = null;
});

updateJobCounts();

const jobsFilterForm = document.querySelector(".jobs-filter-form");
const jobSearchInput = document.getElementById("jobsearch");
const jobStatusInput = document.getElementById("status");
const jobTypeInput = document.getElementById("jobtype");

// gumawa ng lalagyan ng bilang ng matching jobs
const jobFilterResult = document.createElement("p");
jobFilterResult.id = "job-filter-result";
jobFilterResult.setAttribute("role", "status");

document.querySelector(".jobs-table-heading").after(jobFilterResult);

// ipakita lang ang jobs na tugma sa search at filters
function filterJobs() {
    const keyword = jobSearchInput.value.trim().toLowerCase();
    const selectedStatus = jobStatusInput.value;
    const selectedType = jobTypeInput.value;

    const rows = jobsTable.querySelectorAll("tr");
    let matchingCount = 0;

    rows.forEach((row) => {
        const title = row.querySelector(".job-title-cell strong")
            .textContent.trim().toLowerCase();

        const status = row.querySelector(".job-status")
            .textContent.trim();

        const jobType = row.cells[1].textContent.trim();

        const matchesKeyword = title.includes(keyword);

        const matchesStatus = selectedStatus === ""
            || status === selectedStatus;

        const matchesType = selectedType === ""
            || jobType === selectedType;

        const matches = matchesKeyword
            && matchesStatus
            && matchesType;

        row.hidden = !matches;

        if (matches) {
            matchingCount++;
        }
    });

    jobFilterResult.textContent = matchingCount === 0
        ? "No jobs match your filters."
        : `Showing ${matchingCount} of ${rows.length} jobs`;
}

// mag-filter kapag pinindot ang button o enter
jobsFilterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterJobs();
});

// update habang nagta-type o pumipili sa dropdown
jobSearchInput.addEventListener("input", filterJobs);
jobStatusInput.addEventListener("change", filterJobs);
jobTypeInput.addEventListener("change", filterJobs);

filterJobs();