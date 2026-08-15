function showSection(id) {
    let sections = document.querySelectorAll("section");
    sections.forEach(function(section) {
        section.style.display = "none";
    });
    let unhide = document.getElementById(id);
    unhide.style.display = "block";
};