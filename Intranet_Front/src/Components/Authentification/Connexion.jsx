import { Alert, TextField } from "@mui/material";
import { useState } from "react";
export default function Connexion() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    // const [loading, setLoading] = useState(false) 

    const Soumettre = async (e) => {
        e.preventDefault()
        // setLoading(true) 
        if (email === '' || password === '') {
            setError('Veuillez remplir les champs')
        } else {
            setError('une erreur crédentielles')
        }
        setTimeout(() => {
            // setLoading(false)
            alert('Réussi')
        }, 500)
    }

    return <div className='flex flex-col items-center justify-center gap-3  p-3 bg-white h-full w-full'>
        <div className='flex flex-col items-center justify-center gap-3 mb-5'>
            <h2 className={'text-black font-semibold text-4xl'} style={{ color: '#8f9795' }}> Connexion </h2>
        </div>
        <div className={'flex flex-col items-center justify-center gap-2 mb-5 w-full '}>
            <TextField
                label={'Adresse Email'}
                variant='outlined'
                className='w-1/2'
                size="small"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
            >  </TextField>
            <TextField
                label={'Mot de passe'}
                variant='outlined'
                className='w-1/2'
                size="small"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
                type={'password'}
            >  </TextField>
            {error && (
                <div className="w-1/2">
                    <Alert severity="error" >{error}</Alert>
                </div>
            )}
            <button className='p-1.5 hover:bg-sky-900 text-white rounded-lg mt-3 w-1/2' style={{ backgroundColor: '#04adf0' }} onClick={Soumettre}>
                Se Connecter </button>
        </div>
        <div className={'flex flex-col items-center justify-center gap-1 w-full'}>
            <a className={'underline text-blue-500 hover:text-blue-700 hover:text-sky-600'} href={'#'} style={{ color: '#04adf0' }}> Mot de passe oublié? </a>
        </div>
    </div>
}