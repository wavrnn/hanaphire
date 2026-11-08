// edit ng company details
const companyDialog = document.getElementById("company-edit-dialog");
const companyForm = document.getElementById("company-edit-form");
const companyDialogTitle = document.getElementById("company-edit-title");

const companyHeader = document.querySelector(".company-header-info");
const headerDetails = companyHeader.querySelectorAll(
    ".company-header-details span"
);

const informationValues = document.querySelectorAll(
    ".company-information-item strong"
);

const aboutText = document.querySelector(".company-about-text");

// sabay i-update ang details na nasa ibang part ng page
const companyBindings = [
    {
        name: "companyname",
        targets: [companyHeader.querySelector("h1")]
    },
    {
        name: "industry",
        targets: [companyHeader.querySelector("p"), informationValues[0]]
    },
    {
        name: "size",
        targets: [headerDetails[1], informationValues[1]]
    },
    {
        name: "location",
        targets: [headerDetails[0], informationValues[2]]
    },
    {
        name: "website",
        targets: [informationValues[3], headerDetails[2]]
    },
    {
        name: "about",
        targets: [aboutText]
    }
];

// ipakita lang ang fields na ie-edit
const setCompanyGroup = (id, visible) => {
    const group = document.getElementById(id);

    group.hidden = !visible;

    // huwag isama sa check ang nakatagong fields
    group.disabled = !visible;
};

document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
        const section = button.dataset.edit;

        // ilagay ang current details kapag binuksan ang popup
        companyBindings.forEach((binding) => {
            const field = companyForm.elements.namedItem(binding.name);
            let value = binding.targets[0].textContent.trim();

            if (binding.name === "website") {
                value = value === "Not provided" ? "" : value;

                if (value && !/^https?:\/\//i.test(value)) {
                    value = `https://${value}`;
                }
            }

            field.value = value;
            field.setCustomValidity("");
        });

        setCompanyGroup("company-name-fields", section === "all");

        setCompanyGroup(
            "company-information-fields",
            section === "all" || section === "information"
        );

        setCompanyGroup(
            "company-about-fields",
            section === "all" || section === "about"
        );

        companyDialogTitle.textContent = section === "about"
            ? "Edit About the Company"
            : section === "information"
                ? "Edit Company Information"
                : "Edit Company Profile";

        companyDialog.showModal();

        companyForm.querySelector(
            "fieldset:not([hidden]) input, fieldset:not([hidden]) textarea"
        ).focus();
    });
});

// huwag tanggapin ang puro spaces
const validateCompanyText = () => {
    companyForm.querySelectorAll("input, textarea").forEach((field) => {
        field.setCustomValidity(
            field.required && field.value.trim() === ""
                ? "Please complete this field."
                : ""
        );
    });
};

companyForm.addEventListener("input", validateCompanyText);

// check muna ang form bago ilagay ang bagong details sa page
companyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateCompanyText();

    if (!companyForm.reportValidity()) {
        return;
    }

    companyBindings.forEach((binding) => {
        const field = companyForm.elements.namedItem(binding.name);

        if (field.matches(":disabled")) {
            return;
        }

        const value = field.value.trim() || "Not provided";

        binding.targets.forEach((target) => {
            target.textContent = value;
        });
    });

    companyDialog.close();
});

// isara ang popup kapag kinansela
document.getElementById("cancel-company-edit").addEventListener(
    "click",
    () => companyDialog.close()
);