const addBtn = document.getElementById("addBtn");
const container = document.getElementById("notesContainer");
const searchBar = document.getElementById("searchBar");
const themeToggle = document.getElementById("themeToggle");

const colors = ["#c8e6c9", "#ffccbc", "#fff59d"];
let noteIndex = 0;


// ADD NOTE BUTTON
addBtn.addEventListener("click", function () {
    createNote();
});


// CREATE NOTE
function createNote(titleText = "", contentText = "", color = null, pinned = false) {

    const note = document.createElement("div");
    note.classList.add("note");

    const noteColor = color || colors[noteIndex % colors.length];
    noteIndex++;

    note.style.background = noteColor;


    // PIN ICON
    const pinIcon = document.createElement("span");
    pinIcon.textContent = "📌";
    pinIcon.classList.add("pinIcon");

    if (!pinned) {
        pinIcon.style.display = "none";
    }


    // TITLE
    const title = document.createElement("input");
    title.classList.add("noteTitle");
    title.placeholder = "Title";
    title.value = titleText;


    // CONTENT
    const content = document.createElement("textarea");
    content.classList.add("noteContent");
    content.placeholder = "Write your note...";
    content.value = contentText;


    // MENU BUTTON
    const menuBtn = document.createElement("button");
    menuBtn.textContent = "⋮";
    menuBtn.classList.add("menuBtn");


    // MENU
    const menu = document.createElement("div");
    menu.classList.add("menu");


    // PIN BUTTON
    const pinBtn = document.createElement("button");
    pinBtn.textContent = pinned ? "Unpin" : "Pin";


    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";


    // PIN CLICK
    pinBtn.addEventListener("click", function () {

        pinned = !pinned;

        if (pinned) {

            note.classList.add("pinned");
            pinIcon.style.display = "block";
            pinBtn.textContent = "Unpin";

            container.prepend(note);

        } else {

            note.classList.remove("pinned");
            pinIcon.style.display = "none";
            pinBtn.textContent = "Pin";

            container.appendChild(note);

        }

        menu.classList.remove("showMenu");

        saveNotes();

    });


    // DELETE CLICK
    deleteBtn.addEventListener("click", function () {

        menu.classList.remove("showMenu");
        note.remove();
        saveNotes();

    });


    // MENU TOGGLE
    menuBtn.addEventListener("click", function (e) {

        e.stopPropagation();
        closeAllMenus();
        menu.classList.toggle("showMenu");

    });


    // SAVE EVENTS
    title.addEventListener("input", saveNotes);
    content.addEventListener("input", saveNotes);


    // MENU STRUCTURE
    menu.appendChild(pinBtn);
    menu.appendChild(deleteBtn);


    note.appendChild(pinIcon);
    note.appendChild(menuBtn);
    note.appendChild(menu);
    note.appendChild(title);
    note.appendChild(content);


    // POSITION NOTE
    if (pinned) {

        note.classList.add("pinned");
        container.prepend(note);

    } else {

        const pinnedNotes = document.querySelectorAll(".note.pinned");

        if (pinnedNotes.length > 0) {

            pinnedNotes[pinnedNotes.length - 1].after(note);

        } else {

            container.appendChild(note);

        }

    }

    saveNotes();
}


// SAVE NOTES
function saveNotes() {

    const notes = [];

    document.querySelectorAll(".note").forEach(function (note) {

        const title = note.querySelector(".noteTitle").value;
        const content = note.querySelector(".noteContent").value;
        const color = note.style.background;
        const pinned = note.classList.contains("pinned");

        notes.push({
            title: title,
            content: content,
            color: color,
            pinned: pinned
        });

    });

    localStorage.setItem("notes", JSON.stringify(notes));
}


// LOAD NOTES
function loadNotes() {

    const notes = JSON.parse(localStorage.getItem("notes"));

    if (notes) {

        notes.forEach(function (note) {

            createNote(
                note.title,
                note.content,
                note.color,
                note.pinned
            );

        });

    }

}

loadNotes();


// SEARCH (TITLE ONLY)
searchBar.addEventListener("input", function () {

    const searchText = searchBar.value.toLowerCase();

    document.querySelectorAll(".note").forEach(function (note) {

        const title = note.querySelector(".noteTitle").value.toLowerCase();

        if (title.includes(searchText)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }

    });

});


// DARK MODE
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("darkMode");

    if (document.body.classList.contains("darkMode")) {
        themeToggle.textContent = "☀ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
    }

});


// CLOSE ALL MENUS
function closeAllMenus() {

    document.querySelectorAll(".menu").forEach(function(menu){
        menu.classList.remove("showMenu");
    });

}


// CLOSE MENU WHEN CLICKING OUTSIDE
document.addEventListener("click", function () {
    closeAllMenus();
});

window.addEventListener("scroll", function(){

    const addBtn = document.getElementById("addBtn");

    if(window.scrollY > 50){
        addBtn.classList.add("small");
    }else{
        addBtn.classList.remove("small");
    }

});
