import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/login.ts';
import { useAuth } from '../context/AuthContext.tsx';

export function useLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (email: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      // Server sets the httpOnly cookie; response just carries the email for the UI
      const { email: confirmedEmail } = await loginRequest({ email, password });
      login(confirmedEmail);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { submit, error, loading };
}
