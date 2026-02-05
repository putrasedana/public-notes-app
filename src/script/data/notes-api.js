const BASE_URL = "https://notes-api.dicoding.dev/v2";

import Swal from "sweetalert2";

class NotesApi {
  static async createNote(title, body) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      if (response.ok) {
        const responseJson = await response.json();
        const { status, message, data } = responseJson;

        if (status === "success") {
          return data;
        } else {
          throw new Error(`Failed to create note: ${message}`);
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        confirmButtonColor: "#508D4E",
      });
      throw error;
    }
  }

  static async getNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (response.ok) {
        const responseJson = await response.json();
        const data = responseJson.data;

        return data;
      } else {
        throw new Error(`Something went wrong: ${response.statusText}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        confirmButtonColor: "#508D4E",
      });
      throw error;
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);

      if (response.ok) {
        const responseJson = await response.json();
        const data = responseJson.data;

        return data;
      } else {
        throw new Error(`Something went wrong: ${response.statusText}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        confirmButtonColor: "#508D4E",
      });
      throw error;
    }
  }

  static async deleteNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const responseJson = await response.json();
        const { status, message } = responseJson;

        if (status === "success") {
          return message;
        } else {
          throw new Error(`Failed to delete note: ${message}`);
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        confirmButtonColor: "#508D4E",
      });
      throw error;
    }
  }

  static async archiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
        method: "POST",
      });

      if (response.ok) {
        const responseJson = await response.json();
        const { status, message } = responseJson;

        if (status === "success") {
          return message;
        } else {
          throw new Error(`Failed to archive note: ${message}`);
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        confirmButtonColor: "#508D4E",
      });
      throw error;
    }
  }

  static async unarchiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
        method: "POST",
      });

      if (response.ok) {
        const responseJson = await response.json();
        const { status, message } = responseJson;

        if (status === "success") {
          return message;
        } else {
          throw new Error(`Failed to unarchive note: ${message}`);
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
        confirmButtonColor: "#508D4E",
      });
      throw error;
    }
  }
}

export default NotesApi;
