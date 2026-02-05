import { gsap } from "gsap";

const home = () => {
  const notesList = document.getElementById("notes");
  const archivedNotesList = document.getElementById("archived-notes");

  notesList.addEventListener("note-changed", () => {
    notesList.renderNotes();
    archivedNotesList.renderNotes();
  });

  archivedNotesList.addEventListener("note-changed", () => {
    notesList.renderNotes();
    archivedNotesList.renderNotes();
  });

  function createLoadingElement() {
    const loadingElement = document.createElement("div");
    loadingElement.id = "loading";
    loadingElement.className = "loading";
    const spinnerElement = document.createElement("div");
    spinnerElement.className = "spinner";
    loadingElement.appendChild(spinnerElement);
    document.body.appendChild(loadingElement);
  }

  function hideLoadingElement() {
    const loadingElement = document.getElementById("loading");
    gsap.to(loadingElement, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        loadingElement.style.display = "none";
      },
    });
  }

  window.addEventListener("load", () => {
    createLoadingElement();
    hideLoadingElement();
  });
};

export default home;
