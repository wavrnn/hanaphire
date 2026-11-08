// search, filter, at sort ng candidates
const searchForm = document.querySelector(".search-box");
const keywordInput = document.getElementById("keyword");
const locationInput = document.getElementById("location");
const candidateRows = document.querySelectorAll(
    ".candidate-section tbody tr"
);
const resultCount = document.getElementById("result-count");
const experienceInput = document.getElementById("experience");
const applyFiltersButton = document.querySelector(".filter-button");
const categoryInput = document.getElementById("category");
const skillsInput = document.getElementById("skills");
const clearFiltersButton = document.querySelector(".clear-button");
const sortInput = document.getElementById("sort");
const tableBody = document.querySelector(".candidate-section tbody");


// check kung pasok ang experience sa napiling range
const matchesExperience = (years) => {
    const level = experienceInput.value;

    if (level === "entry") {
        return years < 1;
    }

    if (level === "junior") {
        return years >= 1 && years <= 2;
    }

    if (level === "mid") {
        return years >= 3 && years <= 5;
    }

    if (level === "senior") {
        return years >= 6;
    }

    // walang piniling experience filter
    return true;
};

// gawing lowercase at alisin ang spaces sa magkabilang dulo
const normalize = (text) => text.trim().toLowerCase();

searchForm.addEventListener("submit", (event) => {
    // huwag i-reload ang page habang nagfi-filter
    event.preventDefault();

    const keyword = normalize(keywordInput.value);
    const location = normalize(locationInput.value);
    let count = 0;

    const selectedEmployment = Array.from(
        document.querySelectorAll(
            '.filters input[name="employment"]:checked'
        ),
        (checkbox) => checkbox.value
    );
    
    candidateRows.forEach((row) => {
        const name = row.querySelector("strong").textContent;
        const title = row.cells[1].textContent;
        const candidateLocation = normalize(row.cells[3].textContent);
        const skills = row.cells[4].textContent;

        const searchableText = normalize(`${name} ${title} ${skills}`);

        const matchesKeyword = searchableText.includes(keyword);
        const matchesLocation = candidateLocation.includes(location);
        // kunin ang number mula sa years
        const years = parseInt(row.cells[2].textContent, 10);

        const matchesCategory = categoryInput.value === "" || row.dataset.category === categoryInput.value;

        const matchesSkill = normalize(skills).includes(
            normalize(skillsInput.value)
        );

        const employmentTypes = row.dataset.employment.split(" ");

        const matchesEmployment = selectedEmployment.length === 0
            || selectedEmployment.some((type) => {
                return employmentTypes.includes(type);
        });
        
        const matches = matchesKeyword && matchesLocation && matchesExperience(years) && matchesCategory && matchesSkill && matchesEmployment;
    
        row.hidden = !matches;

        if (matches) {
            count++;
        }
    });

    if (count === 0) {
        resultCount.textContent = "No candidates match your search.";
    } else {
        resultCount.textContent =
            `Showing ${count} matching candidate${count === 1 ? "" : "s"}`;
    }
});

// i-filter ulit kapag nagbago ang dropdown
experienceInput.addEventListener("change", () => {
    searchForm.requestSubmit();
});

// gamitin din ang search kapag pinindot ang apply filters
applyFiltersButton.addEventListener("click", () => {
    searchForm.requestSubmit();
});

// i-filter ulit kapag nagbago ang category
categoryInput.addEventListener("change", () => {
    searchForm.requestSubmit();
});

// update ang results habang nagta-type ng skill
skillsInput.addEventListener("input", () => {
    searchForm.requestSubmit();
});

clearFiltersButton.addEventListener("click", () => {
    // burahin ang keyword at location
    searchForm.reset();

    // ibalik sa default ang sidebar filters
    categoryInput.value = "";
    experienceInput.value = "";
    skillsInput.value = "";

    // tanggalin ang check sa employment types
    const employmentCheckboxes = document.querySelectorAll(
        '.filters input[name="employment"]'
    );

    employmentCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // ipakita ulit ang results nang walang filters
    searchForm.requestSubmit();
});

const employmentInputs = document.querySelectorAll(
    '.filters input[name="employment"]'
);

// i-filter kapag may binagong checkbox
employmentInputs.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        searchForm.requestSubmit();
    });
});

// itabi ang unang ayos ng rows
const originalRows = Array.from(candidateRows);

// ayusin ang rows ayon sa pangalan o experience
sortInput.addEventListener("change", () => {
    // gumawa ng copy para hindi mawala ang unang ayos
    const sortedRows = [...originalRows];

    if (sortInput.value === "name") {
        sortedRows.sort((firstRow, secondRow) => {
            const firstName = firstRow
                .querySelector("strong").textContent.trim();

            const secondName = secondRow
                .querySelector("strong").textContent.trim();

            return firstName.localeCompare(secondName);
        });
    } else if (sortInput.value === "experience") {
        sortedRows.sort((firstRow, secondRow) => {
            const firstYears = parseInt(
                firstRow.cells[2].textContent, 10
            );

            const secondYears = parseInt(
                secondRow.cells[2].textContent, 10
            );

            return secondYears - firstYears;
        });
    }

    // ilipat ang rows ayon sa napiling sort
    sortedRows.forEach((row) => {
        tableBody.appendChild(row);
    });
});