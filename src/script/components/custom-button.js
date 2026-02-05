class CustomButton extends HTMLElement {
  static get observedAttributes() {
    return ["color"];
  }

  constructor() {
    super();
    this._color = this.getAttribute("color");
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[`_${name}`] = newValue;
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        button {
          padding: 0.5em 3em;
          color: ${this._color};
          border: solid 1px ${this._color};
          border-bottom: none;
          border-radius: 4px 4px 0 0;
          cursor: pointer;
          width: 100%;
          background: #f9f9f9;
        }
        button:hover {
          color: white;
          background-color: ${this._color};
        }
      </style>
      <button>
        <slot></slot>
      </button>
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("custom-button", CustomButton);
