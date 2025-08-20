import React, { useContext, useState } from "react";
import {
  TextField,
  Alert,
  InputAdornment,
  IconButton,
  Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../images/image005.png";
import api from '../../components/axios';
import { AppContext } from "../../context/AppContext";

export default function ConfidentialiteSecurite() {
  const { user } = useContext(AppContext)

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");

  const toggleShowPassword = (field) => {
    if (field === "current") setShowCurrent(!showCurrent);
    if (field === "new") setShowNew(!showNew);
    if (field === "confirm") setShowConfirm(!showConfirm);
  };

  const Changer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Merci de compléter tous les champs requis.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Le nouveau mot de passe doit correspondre à celui de confirmation."
      );
      setLoading(false);
      return;
    }

    try {
      await api.post("/change-password/" + user.id, {
        currentPassword,
        newPassword,
        confirmPassword
      });
      setSuccess("Le mot de passe a été mis à jour avec succès.");
      setTimeout(() => {
        window.location.href = "/accueil";
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.status === 422) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded p-3 mt-3 mb-3">
      {/* Header */}
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/dashboard"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={Logo} className="h-8" alt="EXTEDIM Logo" />
          </a>
          <div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Réinitialisation du mot de passe
            </span>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="bg-gray-50 p-3 rounded w-full mt-3 mb-3">
        <p className="text-justify">
          Votre mot de passe doit contenir au moins huit (8) caractères ainsi
          qu'une combinaison de chiffres, de lettres et de caractères spéciaux
          (!$@%).
        </p>

        <div className="mt-6 flex items-center justify-center flex-col gap-3">
          <p className="font-medium text-center">
            Modifier votre mot de passe :
          </p>
          <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 gap-4 mt-4 ">
            <TextField
              label="Mot de passe actuel"
              variant="outlined"
              type={showCurrent ? "text" : "password"}
              size="small"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShowPassword("current")}
                      edge="end"
                    >
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Nouveau mot de passe"
              variant="outlined"
              type={showNew ? "text" : "password"}
              size="small"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShowPassword("new")}
                      edge="end"
                    >
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Confirmer votre mot de passe"
              variant="outlined"
              type={showConfirm ? "text" : "password"}
              size="small"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShowPassword("confirm")}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <button
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white w-full rounded cursor-pointer transition"
              onClick={Changer}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
      {
        success && <Snackbar
          autoHideDuration={5000}
          message={success}
        />
      }

      {
        error && <Snackbar
          autoHideDuration={5000}
          message={error}
        />
      }
    </div>
  );
}
