import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  LoaderFunction
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import styles from "./styles/tailwind.css"
import { AuthProvider } from "./context/useAuth";
import { auth as authCookie } from './lib/cookie';
import { auth } from './lib/firebase/firebase.server';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = await authCookie.parse(cookieHeader) || {};

  let user = null;

  try {
    user = await auth.verifySessionCookie(cookies.token, true);
  } catch (err) {
    // cookie expired or any other error
  }

  return json({ user });
}

export default function App() {
  const { user } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider user={user}>
          <header className='shadow'>
            <div className='container flex items-center justify-between h-20'>
              <h1 className='text-4xl flex items-center font-semibold text-white'>Logo</h1>
              <ul>
                {
                  !user
                    ? <li className='flex items-center justify-between px-4 py-2 shadow cursor-pointer transition duration-300 bg-gray-800 hover:bg-gray-700' onClick={() => {/* googleAuthentication */ }}>
                      <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4 mr-2" alt="" /> Sign in with Google
                    </li>
                    : <li className='flex items-center justify-between px-4 py-2 cursor-pointer font-semibold hover:text-gray-100'>
                      <img src={user.picture} className="w-10 rounded-full mr-2" alt="" /> {user.name}
                    </li>
                }
              </ul>
            </div>
          </header>
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
