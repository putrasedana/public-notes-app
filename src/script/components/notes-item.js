import NotesApi from "../data/notes-api.js";
import Utils from "../utils.js";
import gsap from "gsap";

class NotesItem extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .note-item {
          background: #f9f9f9;
          padding: 1rem 1rem 0;
          border: 1px solid black;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .note-title {
          font-weight: bold;
          word-wrap: break-word;
          font-size: 1.2rem
        }
        .note-body{
          word-wrap: break-word;
          margin-bottom: 16px;
        }
        .note-created-at {
          margin: 8px 0 18px;
          color: #444;
          font-size: 0.875rem;
        }
        .btn-container {
          display: flex;
          justify-content: center;
        }
        custom-button{
          margin: 10px 4px 0
        }
      </style>
      <div class="note-item">
        <div class="note-title" id="title"></div>
        <div class="note-created-at" id="created-at"></div>
        <div class="note-body" id="body"></div>
        <div class="btn-container">
          <custom-button id="delete-button" color="red">Delete</custom-button>
          <custom-button id="archive-button" color="green">Archive</custom-button>        
        </div>
      </div>
    `;
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  connectedCallback() {
    this.shadowRoot.getElementById("title").innerText =
      this.getAttribute("title");
    this.shadowRoot.getElementById("created-at").innerText =
      this.getAttribute("created-at");
    this.shadowRoot.getElementById("body").innerText =
      this.getAttribute("body");
    this.updateArchiveButton();
    this.addDeleteListeners();
    this.addArchiveListeners();
    gsap.to(this.shadowRoot.querySelector(".note-item"), {
      duration: 1,
      opacity: 1,
    });
  }

  updateArchiveButton() {
    const archiveButton = this.shadowRoot.getElementById("archive-button");
    const isArchived = this.getAttribute("archived") === "true";
    archiveButton.innerText = isArchived ? "Unarchive" : "Archive";
  }

  async addDeleteListeners() {
    const deleteButton = this.shadowRoot.getElementById("delete-button");

    deleteButton.addEventListener("click", async () => {
      const noteId = this.getAttribute("id");

      try {
        await NotesApi.deleteNote(noteId);
        gsap.to(this.shadowRoot.querySelector(".note-item"), {
          duration: 1,
          opacity: 0,
          onComplete: () => {
            this.dispatchEvent(
              new CustomEvent("note-deleted", {
                detail: { id: noteId },
                bubbles: true,
                composed: true,
              })
            );
          },
        });
        Utils.showToast("success", "Catatan berhasil dihapus!", "Success");
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    });
  }

  async addArchiveListeners() {
    const archiveButton = this.shadowRoot.getElementById("archive-button");

    archiveButton.addEventListener("click", async () => {
      const noteId = this.getAttribute("id");
      const isArchived = this.getAttribute("archived") === "true";

      try {
        if (isArchived) {
          await NotesApi.unarchiveNote(noteId);
        } else {
          await NotesApi.archiveNote(noteId);
        }

        gsap.to(this.shadowRoot.querySelector(".note-item"), {
          duration: 1,
          opacity: 0,
          onComplete: () => {
            this.dispatchEvent(
              new CustomEvent("note-changed", {
                detail: {
                  id: noteId,
                  action: isArchived ? "unarchived" : "archived",
                },
                bubbles: true,
                composed: true,
              })
            );
          },
        });

        Utils.showToast("success", "Catatan berhasil dipindahkan!", "Success");
      } catch (error) {
        console.error(
          `Error ${isArchived ? "unarchiving" : "archiving"} note:`,
          error
        );
      }
    });
  }
}

customElements.define("notes-item", NotesItem);
