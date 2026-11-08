// search at filter ng applications
const applicationFilter = document.querySelector(".applications-filter");
const applicationSearch = document.getElementById("application-search");
const applicationStatus = document.getElementById("application-status");
const applicationCount = document.getElementById("application-count");

const applicationRows = document.querySelectorAll(
    ".applications-table tbody tr"
);

// ipakita lang ang applications na tugma sa search at status
const filterApplications = () => {
    const keyword = applicationSearch.value.trim().toLowerCase();
    const status = applicationStatus.value;
    let count = 0;

    applicationRows.forEach((row) => {
        const title = row.cells[0].textContent;
        const company = row.cells[1].textContent;
        const searchableText = `${title} ${company}`.toLowerCase();

        const matchesKeyword = searchableText.includes(keyword);
        const matchesStatus = status === ""
            || row.dataset.status === status;

        const matches = matchesKeyword && matchesStatus;

        row.hidden = !matches;

        if (matches) {
            count++;
        }
    });

    applicationCount.textContent = count === 0
        ? "No applications match your search."
        : `Showing ${count} of ${applicationRows.length} applications`;
};

// huwag i-reload ang page kapag nag-filter
applicationFilter.addEventListener("submit", (event) => {
    event.preventDefault();
    filterApplications();
});

applicationSearch.addEventListener("input", filterApplications);
applicationStatus.addEventListener("change", filterApplications);

filterApplications();