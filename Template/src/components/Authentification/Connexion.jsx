import { Alert, TextField, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../images/image005.png";
import api from "../axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function Connexion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser, setToken } = useContext(AppContext)
    const Soumettre = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (email === '' || password === '') {
            setError('Veuillez remplir les champs');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/v1/auth', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setToken(response.data.token)
            setUser(response.data.user);
            setSuccess('Connexion réussie');

            setTimeout(() => {
                window.location.href = '/accueil';
            }, 250);

            setEmail('');
            setPassword('');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Email ou mot de passe incorrect');
            } else if (err.response && err.response.status === 422) {
                setError(err.response.data.message);
            } else if (err.response && err.response.status === 403) {
                setError(err.response.data.message);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-2 py-8 w-2/3 rounded-lg bg-white dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center gap-3 mb-5">
                <img alt="Logo" src={Logo} className="w-full" />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 mb-5 w-full">
                <TextField
                    label="Adresse Email"
                    variant="outlined"
                    className="w-2/3 focus:border-none focus:outline-none  focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white MuiOutlinedInput-input:focus"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Mot de passe"
                    variant="outlined"
                    className="w-2/3 focus:border-none  focus:ring-0  focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white MuiOutlinedInput-input:focus"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    className="p-3 hover:bg-sky-900 text-white rounded-lg mt-3 w-2/3 cursor-pointer"
                    style={{ backgroundColor: "#04adf0" }}
                    onClick={Soumettre}
                >
                    {loading ? 'Connexion...' : 'Se Connecter'}
                </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 w-full">
                <a
                    className="underline text-blue-500 hover:text-blue-700 dark:text-sky-400"
                    href="/reset"
                    style={{ color: "#04adf0" }}
                >
                    Mot de passe oublié?
                </a>
            </div>
        </div>
    );
}
