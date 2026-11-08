// save at apply gamit ang browser storage
(() => {
    const storageKey = "hanaphire-job-activity";

    // unang listahan ng saved jobs at applications
    const initialData = {
        saved: [],
        applications: [
            {
                title: "Software Engineer",
                company: "TechNova Solutions",
                date: "Sep 2, 2026",
                status: "In Review"
            },
            {
                title: "Web Developer",
                company: "PixelPoint Inc.",
                date: "Aug 30, 2026",
                status: "Interview"
            },
            {
                title: "Junior Developer",
                company: "WebWorks PH",
                date: "Aug 25, 2026",
                status: "Submitted"
            }
        ]
    };

    let data = initialData;

    try {
        // basahin ang records sa browser storage
        const stored = JSON.parse(localStorage.getItem(storageKey));

        if (
            stored
            && Array.isArray(stored.saved)
            && Array.isArray(stored.applications)
        ) {
            data = stored;
        }
    } catch {
        data = initialData;
    }

    const jobId = (job) => `${job.company}|${job.title}`;

    // i-save muna bago baguhin ang nasa page
    const saveData = (nextData) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(nextData));
            data = nextData;
            return true;
        } catch {
            const notice = document.getElementById("job-action-feedback");

            if (notice) {
                notice.textContent =
                    "Your browser could not save this change. Please check its storage settings.";
            }

            return false;
        }
    };

    // mga function para sa saved jobs at applications
   window.HanapHireJobs = {
    // hanapin ang saved job gamit ang id
    getSaved(id) {
        return data.saved.find((job) => jobId(job) === id);
    },

    // check kung nakapag-apply na sa job
    hasApplied(id) {
        return data.applications.some((job) => jobId(job) === id);
    },

    // idagdag ang application kung wala pa sa listahan
    applySaved(id) {
        const job = data.saved.find((item) => jobId(item) === id);

        if (!job) {
            return false;
        }

        const alreadyApplied = data.applications.some(
            (item) => jobId(item) === id
        );

        if (alreadyApplied) {
            return true;
        }

        const application = {
            ...job,
            date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }),
            status: "Submitted"
        };

        return saveData({
            ...data,
            applications: [application, ...data.applications]
        });
    },

    // alisin ang job sa saved records
    removeSaved(id) {
        return saveData({
            ...data,
            saved: data.saved.filter((job) => jobId(job) !== id)
        });
    }
};


    // job seeker dashboard

    const recommendedPanel = document.querySelector(".recommended-panel");

    if (recommendedPanel) {
        const feedback = document.createElement("p");
        feedback.id = "job-action-feedback";
        feedback.setAttribute("role", "status");
        recommendedPanel.appendChild(feedback);

        const dialog = document.getElementById("apply-job-dialog");
        let pendingJob = null;

        const cards = recommendedPanel.querySelectorAll(".recommended-job");

        // kunin ang details mula sa job card
        const readJob = (card) => {
            const details = card.querySelector(".job-details")
                .textContent.split("•").map((part) => part.trim());

            return {
                title: card.querySelector("h3").textContent.trim(),
                company: card.querySelector(".company-name").textContent.trim(),
                location: details[0],
                setup: details[1],
                type: details[2],
                salary: card.querySelector(".job-salary").textContent.trim(),
                logo: card.querySelector(".company-logo img").getAttribute("src")
            };
        };

        // update ang buttons at bilang sa dashboard
        const updateDashboard = () => {
            cards.forEach((card) => {
                const job = readJob(card);

                const isSaved = data.saved.some(
                    (item) => jobId(item) === jobId(job)
                );

                const isApplied = data.applications.some(
                    (item) => jobId(item) === jobId(job)
                );

                const saveButton = card.querySelector(".save-job-button");
                const applyButton = card.querySelector(".apply-button");

                saveButton.textContent = isSaved ? "Saved" : "Save";
                saveButton.setAttribute("aria-pressed", String(isSaved));

                applyButton.textContent = isApplied ? "Applied" : "Apply";
                applyButton.disabled = isApplied;
            });

            const counts = document.querySelectorAll(".jobseeker-stat-card h2");

            const values = [
                data.applications.length,
                data.applications.filter(
                    (job) => job.status === "In Review"
                ).length,
                data.applications.filter(
                    (job) => job.status === "Interview"
                ).length,
                data.saved.length
            ];

            counts.forEach((heading, index) => {
                heading.textContent = values[index];
            });
        };

        cards.forEach((card) => {
            // i-save o alisin sa saved list ang job
            card.querySelector(".save-job-button").addEventListener(
                "click",
                () => {
                    const job = readJob(card);
                    const isSaved = data.saved.some(
                        (item) => jobId(item) === jobId(job)
                    );

                    const saved = isSaved
                        ? data.saved.filter(
                            (item) => jobId(item) !== jobId(job)
                        )
                        : [...data.saved, job];

                    if (saveData({ ...data, saved })) {
                        updateDashboard();

                        feedback.textContent = isSaved
                            ? `${job.title} removed from Saved Jobs.`
                            : `${job.title} added to Saved Jobs.`;
                    }
                }
            );

            // buksan ang apply confirmation
            card.querySelector(".apply-button").addEventListener(
                "click",
                () => {
                    pendingJob = readJob(card);

                    document.getElementById("application-job-name")
                        .textContent = pendingJob.title;

                    dialog.returnValue = "";
                    dialog.showModal();
                }
            );
        });

        // idagdag ang application kapag nag-confirm
        dialog.addEventListener("close", () => {
            if (dialog.returnValue === "apply" && pendingJob) {
                const alreadyApplied = data.applications.some(
                    (job) => jobId(job) === jobId(pendingJob)
                );

                if (!alreadyApplied) {
                    const application = {
                        ...pendingJob,
                        date: new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        }),
                        status: "Submitted"
                    };

                    if (saveData({
                        ...data,
                        applications: [application, ...data.applications]
                    })) {
                        updateDashboard();
                        feedback.textContent =
                            `Application for ${pendingJob.title} recorded.`;
                    }
                }
            }

            pendingJob = null;
        });

        updateDashboard();
    }


    // saved jobs page
    // unahin ito bago ang script ng saved jobs

    const savedList = document.querySelector(".saved-jobs-list");

    if (savedList) {

        // idagdag nang isang beses ang original cards, kasama ang dating saves
        if (!data.savedInitialized) {
            const originalCards = savedList.querySelectorAll(".saved-job-card");

            const originalJobs = Array.from(originalCards, (card) => {
                const details = card.querySelectorAll(".saved-job-details span");

                return {
                    title: card.querySelector("h2").textContent.trim(),
                    company: card.querySelector(".saved-company").textContent.trim(),
                    location: details[0].textContent.trim(),
                    setup: details[1].textContent.trim(),
                    type: details[2].textContent.trim(),
                    salary: card.querySelector(".saved-salary").textContent.trim(),
                    logo: card.querySelector(".saved-company-logo img")
                        .getAttribute("src")
                };
            });

            const missingJobs = originalJobs.filter((originalJob) => {
                return !data.saved.some(
                    (savedJob) => jobId(savedJob) === jobId(originalJob)
                );
            });

            const restored = saveData({
                ...data,
                saved: [...data.saved, ...missingJobs],
                savedInitialized: true
            });

            if (!restored) {
                return;
            }
        }
        
        const template = savedList.querySelector(".saved-job-card")
            .cloneNode(true);

        savedList.querySelectorAll(".saved-job-card").forEach(
            (card) => card.remove()
        );

        // gumawa ng card para sa bawat saved job
        data.saved.forEach((job) => {
            const card = template.cloneNode(true);

            card.dataset.jobId = jobId(job);
            card.dataset.jobtype = job.type;
            card.dataset.worksetup = job.setup;

            card.querySelector("h2").textContent = job.title;
            card.querySelector(".saved-company").textContent = job.company;
            card.querySelector(".saved-salary").textContent = job.salary;
            card.querySelector(".saved-company-logo img").src = job.logo;
            card.querySelector(".saved-company-logo img").alt = job.company;

            const details = card.querySelectorAll(".saved-job-details span");

            [job.location, job.setup, job.type].forEach((value, index) => {
                details[index].textContent = value;
            });

            card.querySelector(".saved-description").textContent =
                "Saved from your recommended opportunities.";

            card.querySelector(".saved-job-bottom > span").textContent =
                "Saved to your list";

            savedList.appendChild(card);
        });
    }


    // my applications page
    // unahin ito bago ang script ng applications

    const applicationBody = document.querySelector(
        ".applications-table tbody"
    );

    if (applicationBody) {
        applicationBody.replaceChildren();

        const statusClasses = {
            "Submitted": "badge-submitted",
            "In Review": "badge-review",
            "Interview": "badge-interview"
        };

        // gumawa ng row para sa bawat application
        data.applications.forEach((job) => {
            const row = document.createElement("tr");
            row.dataset.status = job.status;

            [job.title, job.company, job.date].forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            const badge = document.createElement("span");

            badge.className =
                `application-badge ${statusClasses[job.status] || ""}`;

            badge.textContent = job.status;
            statusCell.appendChild(badge);
            row.appendChild(statusCell);

            applicationBody.appendChild(row);
        });
    }
})();