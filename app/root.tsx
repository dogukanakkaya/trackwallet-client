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

  const user = await auth.verifySessionCookie(cookies.token, true);

  return json({ user })
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
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
