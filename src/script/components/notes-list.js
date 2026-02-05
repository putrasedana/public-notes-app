import NotesApi from "../data/notes-api.js";
import gsap from "gsap";

const template = document.createElement("template");
template.innerHTML = `
   <style>
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 80%;
    }
    .notes-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    h2 {  
      text-align: center;
      margin: 4rem 0 1.5rem;    
    }
    .show {
      display: block;
    }
    #message {
      font-size: 1.2rem;
      font-weight: lighter;
      color: rgba(0, 0, 0, 0.5);
      text-align: center;
    }
  </style>
  <h2 id="title"></h2>
  <div id="message"></div>
  <custom-loading class="show"></custom-loading>
  <div class="notes-container" id="notes-list"></div>
`;

export default class NotesList extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.renderNotes();
  }

  static get observedAttributes() {
    return ["title", "archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.shadowRoot.getElementById("title").innerText = newValue;
    }
  }

  async renderNotes() {
    this.shadowRoot.querySelector("custom-loading").classList.add("show");
    const notesList = this.shadowRoot.getElementById("notes-list");
    const messageAlert = this.shadowRoot.getElementById("message");
    notesList.innerHTML = "";
    messageAlert.textContent = "";
    const formatDate = (date) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("id-ID", options);
    };

    const isArchivedList = this.getAttribute("archived") === "true";

    try {
      const notes = isArchivedList
        ? await NotesApi.getArchivedNotes()
        : await NotesApi.getNotes();
      if (notes.length === 0) {
        messageAlert.textContent = "Belum ada catatan!";
      } else {
        notes.forEach((note) => {
          const listItem = document.createElement("notes-item");
          listItem.setAttribute("id", note.id);
          listItem.setAttribute("title", note.title);
          listItem.setAttribute("created-at", formatDate(note.createdAt));
          listItem.setAttribute("body", note.body);
          listItem.setAttribute("archived", note.archived);
          listItem.addEventListener("note-deleted", () => this.renderNotes());

          notesList.appendChild(listItem);
          gsap.fromTo(
            listItem.shadowRoot.querySelector(".note-item"),
            { opacity: 0 },
            { duration: 2, opacity: 1 }
          );
        });
      }
    } catch (error) {
      console.error("Error rendering notes:", error);
    } finally {
      this.shadowRoot.querySelector("custom-loading").classList.remove("show");
    }
  }
}

customElements.define("notes-list", NotesList);
