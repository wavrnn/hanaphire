// print ng candidate profile
const printButton = document.getElementById("print-profile");

// buksan ang print preview
printButton.addEventListener("click", () => {
    window.print();
});