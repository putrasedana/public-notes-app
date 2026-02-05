import NotesApi from "../data/notes-api.js";
import Utils from "../utils.js";

class NotesInput extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
        :host {
          display: block;
          padding: 16px;
          border: 1px solid #1A5319;
          border-radius: 8px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        @media (max-width: 768px) {
          :host {
            width: 95%;
            padding: 0;
          }

          .form-group{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: start;
          }

          .input-container{
            padding: 20px;
          }

          h2 {
            margin-bottom: 12px;
          }
        }


        @media (min-width: 768px) {
          :host {
            width: 75%;
          }

          .input-container{
            width: 100%;
            margin: auto;
            padding: 30px;
          }
        }

        @media (min-width: 1024px) and (max-width: 1200px) {
          :host {
            width: 60%;
          }
        }

         @media (min-width: 1201px){
           :host {
            width: 45%;
          }
         }

        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .input-container{
          width: 100%;
          margin: auto;
          padding: 30px;
        }
          
        input, textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 12px;
          border: 1px solid transparent;
          border: 1px solid #1A5319;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 1rem;
          outline: none;
        }

        label{
          padding: 10px 0;  
        }

        .form-group{
          display: flex;
          flex-direction: column;
          align-items: start;
        }

        textarea {
          height: 150px;
        }

        button{
          color: white;
          background-color: #508D4E;
          padding: 10px;
          border: none;
          margin-top: 1rem;
          width:100%;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .validation-message {
          color: red;
          font-size: 0.875rem;
        }

        .show {
          display: block; 
          margin-top: 1.2rem;
        }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
      <form class="input-container">
        <h2>Formulir Tambah Catatan</h2>

        <div class="form-group">
          <label for="title">Judul:</label>
          <input  
            type="text"
            id="title"
            name="title"
            required
            minlength="6"
            autocomplete="off"
            aria-describedby="titleValidation" 
            title="title" 
            placeholder="Masukan judul"
          />
          <p id="titleValidation" class="validation-message" aria-live="polite"></p>
        </div>

        <div class="form-group">
          <label for="message">Pesan:</label>
          <textarea 
            id="message" 
            name="message" 
            placeholder="Masukan pesan" 
            required
            aria-describedby="messageValidation"
            ></textarea>
          <p id="messageValidation" class="validation-message" aria-live="polite"></p>
        </div>

        <button type="submit">Tambah Catatan</button>
        <custom-loading></custom-loading>
      </form>
    `;
  }

  addEventListeners() {
    const form = this._shadowRoot.querySelector("form");
    const titleInput = form.elements.title;
    const messageInput = form.elements.message;
    const loading = this._shadowRoot.querySelector("custom-loading");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const notesListElement = document.querySelector("notes-list");

      if (notesListElement) {
        loading.classList.add("show");

        try {
          const title = titleInput.value;
          const body = messageInput.value;

          await NotesApi.createNote(title, body);

          titleInput.value = "";
          messageInput.value = "";

          await notesListElement.renderNotes();
          notesListElement.scrollIntoView({ behavior: "smooth" });
          Utils.showToast(
            "success",
            "Catatan berhasil ditambahkan!",
            "Success"
          );
        } catch (error) {
          console.error(`Error: ${error.message}`);
        } finally {
          loading.classList.remove("show");
        }
      }
    });

    const customValidationTitleHandler = (event) => {
      event.target.setCustomValidity("");

      if (event.target.validity.valueMissing) {
        event.target.setCustomValidity("Wajib diisi.");
        return;
      }

      if (event.target.validity.tooShort) {
        event.target.setCustomValidity(
          "Minimal panjang judul adalah enam karakter."
        );
        return;
      }
    };

    titleInput.addEventListener("change", customValidationTitleHandler);
    titleInput.addEventListener("invalid", customValidationTitleHandler);
    titleInput.addEventListener("blur", (event) => {
      const isValid = event.target.validity.valid;
      const errorMessage = event.target.validationMessage;

      const connectedValidationId =
        event.target.getAttribute("aria-describedby");
      const connectedValidationEl = connectedValidationId
        ? this._shadowRoot.getElementById(connectedValidationId)
        : null;

      if (connectedValidationEl && errorMessage && !isValid) {
        connectedValidationEl.innerText = errorMessage;
      } else {
        connectedValidationEl.innerText = "";
      }
    });

    const customValidationMessageHandler = (event) => {
      event.target.setCustomValidity("");

      if (event.target.validity.valueMissing) {
        event.target.setCustomValidity("Wajib diisi.");
        return;
      }
    };

    messageInput.addEventListener("change", customValidationMessageHandler);
    messageInput.addEventListener("invalid", customValidationMessageHandler);
    messageInput.addEventListener("blur", (event) => {
      const isValid = event.target.validity.valid;
      const errorMessage = event.target.validationMessage;

      const connectedValidationId =
        event.target.getAttribute("aria-describedby");
      const connectedValidationEl = connectedValidationId
        ? this._shadowRoot.getElementById(connectedValidationId)
        : null;

      if (connectedValidationEl && errorMessage && !isValid) {
        connectedValidationEl.innerText = errorMessage;
      } else {
        connectedValidationEl.innerText = "";
      }
    });
  }
}

customElements.define("notes-input", NotesInput);
