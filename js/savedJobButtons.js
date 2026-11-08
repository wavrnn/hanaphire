// view details, apply, at remove ng saved jobs
(() => {
    const list = document.querySelector(".saved-jobs-list");
    const store = window.HanapHireJobs;

    const detailsDialog = document.getElementById("saved-details-dialog");
    const detailsContent = document.getElementById("saved-details-content");

    const actionDialog = document.getElementById("saved-action-dialog");
    const actionTitle = document.getElementById("saved-action-title");
    const actionDescription = document.getElementById(
        "saved-action-description"
    );
    const confirmButton = document.getElementById("saved-action-confirm");

    const feedback = document.createElement("p");
    feedback.id = "saved-action-feedback";
    feedback.setAttribute("role", "status");
    list.prepend(feedback);

    let pendingCard = null;
    let pendingAction = "";

    // gawing applied ang button kung may application na
    const updateApplyButtons = () => {
        list.querySelectorAll(".saved-job-card").forEach((card) => {
            const button = card.querySelector(".saved-apply-button");
            const applied = store.hasApplied(card.dataset.jobId);

            button.textContent = applied ? "Applied" : "Apply Now";
            button.disabled = applied;
        });
    };

    // isang click event para sa mga job card buttons
    list.addEventListener("click", (event) => {
        const button = event.target.closest(
            ".details-button, .saved-apply-button, .remove-button"
        );

        if (!button) {
            return;
        }

        event.preventDefault();

        const card = button.closest(".saved-job-card");
        const job = store.getSaved(card.dataset.jobId);

        if (!job) {
            feedback.textContent =
                "This job could not be found. Please refresh the page.";
            return;
        }

        feedback.textContent = "";

        if (button.classList.contains("details-button")) {
            detailsContent.replaceChildren();

            const fields = [
                ["Job Title", job.title],
                ["Company", job.company],
                ["Location", job.location],
                ["Work Setup", job.setup],
                ["Job Type", job.type],
                ["Salary", job.salary]
            ];

            fields.forEach(([label, value]) => {
                const heading = document.createElement("dt");
                const detail = document.createElement("dd");

                heading.textContent = label;
                detail.textContent = value || "Not provided";

                detailsContent.append(heading, detail);
            });

            detailsDialog.showModal();
            return;
        }

        const isRemove = button.classList.contains("remove-button");

        if (!isRemove && store.hasApplied(card.dataset.jobId)) {
            return;
        }

        pendingCard = card;
        pendingAction = isRemove ? "remove" : "apply";

        actionTitle.textContent = isRemove
            ? "Remove saved job?"
            : "Apply for this position?";

        actionDescription.textContent = isRemove
            ? `Remove "${job.title}" from your saved jobs?`
            : `Confirm your application for "${job.title}" at ${job.company}.`;

        confirmButton.textContent = isRemove
            ? "Remove Job"
            : "Confirm Application";

        confirmButton.classList.toggle("saved-modal-danger", isRemove);
        confirmButton.classList.toggle("saved-modal-primary", !isRemove);

        actionDialog.returnValue = "";
        actionDialog.showModal();
    });

    // ituloy ang apply o remove kapag nag-confirm
    actionDialog.addEventListener("close", () => {
        if (actionDialog.returnValue === "confirm" && pendingCard) {
            const id = pendingCard.dataset.jobId;

            if (pendingAction === "remove") {
                if (store.removeSaved(id)) {
                    pendingCard.remove();
                    updateSavedCount();
                    filterSavedJobs();

                    feedback.textContent = "Job removed from Saved Jobs.";

                    document.getElementById("search").focus();
                }
            } else if (store.applySaved(id)) {
                updateApplyButtons();

                feedback.textContent =
                    "Application recorded. You can review it in My Applications.";
            }
        }

        pendingCard = null;
        pendingAction = "";
    });

    updateApplyButtons();
})();