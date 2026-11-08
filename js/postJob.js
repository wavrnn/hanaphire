// check ng job form at review bago i-publish
const jobForm = document.querySelector(".post-job-form");
const reviewSection = document.getElementById("job-review");
const reviewDetails = document.getElementById("review-details");
const publishMessage = document.getElementById("publish-message");
const steps = document.querySelectorAll(".form-steps .step");

const minimumSalary = jobForm.elements.namedItem("minimumsalary");
const maximumSalary = jobForm.elements.namedItem("maximumsalary");

// check kung tama ang minimum at maximum salary
const checkSalary = () => {
    let error = "";

    if (
        minimumSalary.value !== ""
        && maximumSalary.value !== ""
        && Number(minimumSalary.value) > Number(maximumSalary.value)
    ) {
        error = "Maximum salary must be equal to or higher than minimum salary.";
    }

    maximumSalary.setCustomValidity(error);
};

minimumSalary.addEventListener("input", checkSalary);
maximumSalary.addEventListener("input", checkSalary);

// ilagay sa review ang mga sagot sa form
jobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkSalary();

    if (!jobForm.reportValidity()) {
        return;
    }

    reviewDetails.replaceChildren();
    publishMessage.textContent = "";

    const fields = [
        ["Company Name", "companyname"],
        ["Company Location", "companylocation"],
        ["Industry", "industry"],
        ["Company Size", "companysize"],
        ["Website", "website"],
        ["Job Title", "jobtitle"],
        ["Job Type", "jobtype"],
        ["Minimum Salary", "minimumsalary"],
        ["Maximum Salary", "maximumsalary"],
        ["Currency", "currency"],
        ["Work Setup", "worksetup"],
        ["Job Location", "joblocation"],
        ["Job Description", "description"],
        ["Qualifications", "qualifications"]
    ];

    fields.forEach(([label, name]) => {
        const field = jobForm.elements.namedItem(name);
        const heading = document.createElement("dt");
        const value = document.createElement("dd");

        heading.textContent = label;

        value.textContent = field.tagName === "SELECT"
            ? field.selectedOptions[0].textContent
            : field.value.trim() || "Not provided";

        reviewDetails.append(heading, value);
    });

    jobForm.hidden = true;
    reviewSection.hidden = false;

    steps[0].classList.remove("active-step");
    steps[1].classList.add("active-step");

    document.getElementById("edit-job").focus();
});

// bumalik sa form nang hindi nabubura ang sagot
document.getElementById("edit-job").addEventListener("click", () => {
    reviewSection.hidden = true;
    jobForm.hidden = false;
    publishMessage.textContent = "";

    steps[1].classList.remove("active-step");
    steps[0].classList.add("active-step");

    document.getElementById("jobtitle").focus();
});

// buksan ang confirmation popup
const publishDialog = document.getElementById("publish-dialog");
const publishButton = document.getElementById("publish-job");

publishButton.addEventListener("click", () => {
    publishDialog.returnValue = "";
    publishDialog.showModal();
});

// gawin ang pinili sa popup
const publishSuccess = document.getElementById("publish-success");
const publishedJobTitle = document.getElementById("published-job-title");
const closePublishSuccess = document.getElementById(
    "close-publish-success"
);

// ipakita ang success popup kapag nag-confirm
publishDialog.addEventListener("close", () => {
    if (publishDialog.returnValue === "confirm") {
        publishMessage.textContent = "";

        publishedJobTitle.textContent = jobForm.elements
            .namedItem("jobtitle").value.trim();

        publishSuccess.showModal();
    }
});

// isara ang success popup
closePublishSuccess.addEventListener("click", () => {
    publishSuccess.close();
});