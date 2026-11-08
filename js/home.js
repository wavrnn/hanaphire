// popup ng featured candidates at companies
const homeProfileDialog = document.getElementById("home-profile-dialog");

document.querySelectorAll(".home-profile-button").forEach((button) => {
    const card = button.closest(".home-profile-card");

    // huwag isama ang close button ng popup
    if (!card) {
        return;
    }

    // ipakita sa popup ang napiling profile
    button.addEventListener("click", () => {
        const image = card.querySelector(".home-profile-image");
        const previewImage = document.getElementById("home-preview-image");

        previewImage.src = image.getAttribute("src");
        previewImage.alt = image.alt;

        document.getElementById("home-preview-label").textContent =
            card.classList.contains("home-employer-card")
                ? "Company overview"
                : "Candidate overview";

        document.getElementById("home-preview-name").textContent =
            card.querySelector("h3").textContent;

        document.getElementById("home-preview-role").textContent =
            card.querySelector(".home-profile-role").textContent;

        document.getElementById("home-preview-location").textContent =
            card.querySelector(".home-profile-location").textContent;

        const previewTags = document.getElementById("home-preview-tags");
        previewTags.replaceChildren();

        card.querySelectorAll(".home-profile-tags span").forEach((tag) => {
            previewTags.appendChild(tag.cloneNode(true));
        });

        const fullProfile = document.getElementById("home-full-profile");
        fullProfile.hidden = !card.dataset.profile;

        if (card.dataset.profile) {
            fullProfile.href = card.dataset.profile;
        } else {
            fullProfile.removeAttribute("href");
        }

        homeProfileDialog.showModal();
    });
});