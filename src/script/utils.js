import toastr from "toastr";

class Utils {
  static showToast(type, message, title) {
    const options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };

    if (toastr[type]) {
      toastr[type](message, title, options);
    } else {
      console.error(`Invalid toast type: ${type}`);
    }
  }
}

export default Utils;
