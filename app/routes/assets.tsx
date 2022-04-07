import { GoogleAuthProvider, signInWithPopup, AuthProvider } from 'firebase/auth';
import useAuth from '../context/useAuth';
import { auth } from '../lib/firebase/firebase';
import { Outlet } from 'remix';

export default function Assets() {
  const { user } = useAuth();

  const googleAuthentication = async () => {
    const provider = new GoogleAuthProvider();

    await authentication(provider);
  }

  const authentication = async (provider: AuthProvider) => await signInWithPopup(auth, provider)

  return (
    <main className='container mt-10'>
      <h1 className='text-2xl font-semibold mb-5'>Assets</h1>
      <Outlet />
    </main>
  );
}
