import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { api } from '../lib/axios';

// todo: legacy interface, replace this with the new one from auth service
export interface User {
    name: string;
    picture: string;
    email: string;
    email_verified: true;
    uid: string;
}

interface Context {
    user: User | null;
}

interface ContextProps {
    children: ReactNode;
    user: User | null;
}

const AuthContext = createContext<Context>({} as Context);

export const AuthProvider = (props: ContextProps) => {
    const [user, setUser] = useState<User | null>(props.user);

    useEffect(() => {
        if (!user) {
            const subscribe = onAuthStateChanged(auth, async (authUser) => {
                if (authUser) {
                    const token = await authUser.getIdToken();

                    try {
                        const { data: { data } } = await api.post('/auth/login', {
                            token
                        }, {
                            withCredentials: true
                        });
                        setUser(data.user);
                    } catch (_) {
                        setUser(null);
                    }
                }
            });

            return () => subscribe()
        }
    }, [user])

    const memoizedValue = useMemo(() => ({
        user
    }), [user]);

    return (
        <AuthContext.Provider value={memoizedValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}
