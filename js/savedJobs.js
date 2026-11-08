// bilang at filter ng saved jobs
const savedList = document.querySelector(".saved-jobs-list");
const savedCount = document.getElementById("saved-count");
const emptyMessage = document.getElementById("saved-empty");
const removeButtons = savedList.querySelectorAll(".remove-button");

// bilangin ang natitirang saved jobs
const updateSavedCount = () => {
    const remainingJobs = savedList.querySelectorAll(".saved-job-card");

    savedCount.textContent = remainingJobs.length;
    emptyMessage.hidden = remainingJobs.length !== 0;
};

// ipakita ang tamang bilang pag-load ng script
updateSavedCount();

const filterForm = document.querySelector(".saved-filter-form");
const searchInput = document.getElementById("search");
const jobTypeInput = document.getElementById("jobtype");
const workSetupInput = document.getElementById("worksetup");
const resultsMessage = document.getElementById("saved-results");

// i-filter ang saved jobs ayon sa search, type, at setup
function filterSavedJobs() {
    const keyword = searchInput.value.trim().toLowerCase();
    const jobType = jobTypeInput.value;
    const workSetup = workSetupInput.value;

    // kunin lang ang mga cards na hindi pa na-remove
    const jobCards = savedList.querySelectorAll(".saved-job-card");
    let matchingCount = 0;

    jobCards.forEach((card) => {
        const title = card.querySelector("h2").textContent;
        const company = card.querySelector(".saved-company").textContent;
        const searchableText = `${title} ${company}`.toLowerCase();

        const matchesKeyword = searchableText.includes(keyword);

        const matchesJobType = jobType === ""
            || card.dataset.jobtype === jobType;

        const matchesWorkSetup = workSetup === ""
            || card.dataset.worksetup === workSetup;

        const matches = matchesKeyword
            && matchesJobType
            && matchesWorkSetup;

        card.hidden = !matches;

        if (matches) {
            matchingCount++;
        }
    });

    if (jobCards.length === 0) {
        // may hiwalay na message kapag walang saved jobs
        resultsMessage.textContent = "";
    } else if (matchingCount === 0) {
        resultsMessage.textContent = "No saved jobs match your filters.";
    } else {
        resultsMessage.textContent =
            `Showing ${matchingCount} of ${jobCards.length} saved jobs`;
    }
}

filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterSavedJobs();
});

jobTypeInput.addEventListener("change", filterSavedJobs);
workSetupInput.addEventListener("change", filterSavedJobs);

filterSavedJobs();