class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  static observedAttributes = ["bg-color", "color"];

  constructor() {
    super();

    this._bgColor = this.getAttribute("bg-color");
    this._color = this.getAttribute("color");
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
        }
        
      div {
        color: ${this._color};
        background-color: ${this._bgColor};
        padding: 24px 20px;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
      <div>
        <slot name="bar-content"></slot>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[`_${name}`] = newValue;
    this.render();
  }
}

customElements.define("app-bar", AppBar);
