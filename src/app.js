import "./styles/style.css";
import "./script/components/index.js";
import home from "./script/view/home.js";
import "toastr/build/toastr.min.css";

document.addEventListener("DOMContentLoaded", () => {
  home();
});
