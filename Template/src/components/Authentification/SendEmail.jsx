import { Alert, TextField } from "@mui/material";
import { useState } from "react";
import api from "../axios";

export default function SendEmail() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Soumettre = async (e) => {
    e.preventDefault(); 

    if (email === "") {
      setError("Veuillez remplir le champ");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setError("");
      setSuccess(
        response.data.message ||
        "Un e-mail de confirmation vous a été envoyé afin de valider le changement de votre mot de passe."
      );
      setEmail("");
    } catch (err) {
      setError(err.response?.data.message);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-2 py-8 w-2/3 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center gap-3 mb-5">
        <h1
          className="text-black font-semibold text-2xl dark:text-white text-center"
          style={{ color: "#8f9795" }}
        >
          Réinitialisation du mot de passe
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={Soumettre}
        className="flex flex-col items-center justify-center gap-2 mb-5 w-full"
      >
        <TextField
          label="Adresse Email"
          variant="outlined"
          className="w-2/3 border focus:border-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Alerts */}
        {success && (
          <div className="w-2/3">
            <Alert severity="success" className="dark:bg-gray-700 dark:text-green-400">
              {success}
            </Alert>
          </div>
        )}
        {error && (
          <div className="w-2/3">
            <Alert severity="error" className="dark:bg-gray-700 dark:text-red-400">
              {error}
            </Alert>
          </div>
        )}

        <button
          type="submit" // ✅ submit button triggers form submit
          className="p-3 hover:bg-sky-900 text-white rounded-lg mt-3 w-2/3 cursor-pointer"
          style={{ backgroundColor: "#1a497f" }}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      <div className="flex flex-col items-center justify-center gap-1 w-full">
        <a
          className="underline text-blue-500 hover:text-blue-700 hover:text-sky-600 dark:text-sky-400"
          href="/"
          style={{ color: "#04adf0" }}
        >
          Retour à la page d'accueil
        </a>
      </div>
    </div>
  );
}
