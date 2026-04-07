// src/features/auth/Login.tsx 

import { useState, type FormEvent } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import type { RootState } from '../../store';
import styles from './Login.module.css';

export default function Login() { 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const from = (location.state as { from?: string })?.from || '/dashboard'; 
  
  async function handleSubmit(e: FormEvent<HTMLFormElement>) { 
    e.preventDefault(); 
    dispatch(loginStart()); 
  
    try { 
      const res = await fetch( 
        `http://localhost:4000/users?email=${email}` 
      ); 
      const users = await res.json(); 
  
      if (users.length === 0 || users[0].password !== password) { 
        dispatch(loginFailure('Email ou mot de passe incorrect')); 
        return; 
      } 
  
      const userData = users[0];
      const user = { id: userData.id, email: userData.email, name: userData.name };
      // Après LOGIN_SUCCESS, créer un faux JWT : 
      const fakeToken = btoa(JSON.stringify({ 
        userId: user.id, 
        email: user.email, 
        role: 'admin', 
        exp: Date.now() + 3600000  // expire dans 1h 
      }));
      
      // Stocker le token dans le state (PAS localStorage) : 
      dispatch(loginSuccess({ user, token: fakeToken })); 
      navigate(from, { replace: true }); 
    } catch { 
      dispatch(loginFailure('Erreur de connexion au serveur')); 
    } 
  } 
  
  return ( 
    <div className={styles.container}> 
      <form className={styles.form} onSubmit={handleSubmit}> 
        <h1 className={styles.title}>TaskFlow</h1> 
        <p className={styles.subtitle}>Connectez-vous pour continuer</p> 
  
        {error && <div className={styles.error}>{error}</div>} 
  
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className={styles.input} 
          required 
        /> 
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className={styles.input} 
          required 
        /> 
  
        <button 
          type="submit" 
          className={styles.button} 
          disabled={loading} 
        > 
          {loading ? 'Connexion...' : 'Se connecter'} 
        </button> 
      </form> 
    </div> 
  ); 
}