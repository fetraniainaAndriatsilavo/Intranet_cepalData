import { Alert, TextField, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from '../axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const Changer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!password || !new_password || !confirm_password) {
      setError("Veuillez remplir les champs");
      setLoading(false);
      return;
    }

    if (new_password.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (new_password !== confirm_password) {
      setError("Le nouveau mot de passe doit être identique à celui de la confirmation.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/teste", {
        password,
        new_password,
        confirm_password,
      });

      setSuccess("Changement de mot de passe effectué avec succès.");
      setTimeout(() => {
        window.location.href = "/accueil";
      }, 1000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Mot de passe actuel incorrect.");
      } else if (err.response?.status === 422) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
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

      <form onSubmit={Changer} className="flex flex-col items-center justify-center gap-2 mb-5 w-full">
        <TextField
          label="Mot de passe actuel"
          variant="outlined"
          className="w-2/3 dark:bg-gray-700"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Nouveau mot de passe"
          variant="outlined"
          className="w-2/3 dark:bg-gray-700"
          type={showNewPassword ? "text" : "password"}
          value={new_password}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" size="small">
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirmez votre nouvel mot de passe"
          variant="outlined"
          className="w-2/3 dark:bg-gray-700"
          type={showConfirmPassword ? "text" : "password"}
          value={confirm_password}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <div className="w-2/3">
            <Alert severity="error" className="dark:bg-gray-700 dark:text-red-400">
              {error}
            </Alert>
          </div>
        )}

        {success && (
          <div className="w-2/3">
            <Alert severity="success" className="dark:bg-gray-700 dark:text-green-400">
              {success}
            </Alert>
          </div>
        )}

        <button
          type="submit"
          className="p-3 hover:bg-sky-900 text-white rounded-lg mt-3 w-2/3 cursor-pointer"
          style={{ backgroundColor: "#04adf0" }}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Valider"}
        </button>
      </form>
    </div>
  );
}
