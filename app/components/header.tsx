import useAuth from '../context/useAuth'
import { auth } from '../lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, AuthProvider } from 'firebase/auth';


const googleAuthentication = async () => {
    const provider = new GoogleAuthProvider();

    await authentication(provider);
}

const authentication = async (provider: AuthProvider) => await signInWithPopup(auth, provider)

export const Header = () => {
    const { user } = useAuth();
    return (
        <header className='shadow'>
            <div className='container flex items-center justify-between h-20'>
                <h1 className='text-4xl flex items-center font-semibold text-white'>Logo</h1>
                <ul>
                    {
                        !user
                            ? <li className='flex items-center justify-between px-4 py-2 shadow cursor-pointer transition duration-300 bg-gray-800 hover:bg-gray-700' onClick={googleAuthentication}>
                                <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 mr-2" alt="" /> Sign in with Google
                            </li>
                            : <li className='flex items-center justify-between px-4 py-2 cursor-pointer font-semibold hover:text-gray-100'>
                                <img src={user.picture} className="w-10 rounded-full mr-2" alt="" /> {user.name}
                            </li>
                    }
                </ul>
            </div>
        </header>
    )
}
