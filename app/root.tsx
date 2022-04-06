import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import styles from "./styles/tailwind.css"
import { AuthProvider } from "./context/useAuth";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: any) {
  const cookieHeader = request.headers.get("Cookie");

  /*
  const response = await fetch('https://127.0.0.1:5000/auth/verify', {
    headers: {
      Cookie: cookieHeader,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  const result = await response.json()
  */

  const result = {status: false, data: null};

  return result.status ? json({ user: result.data }) : json({ user: null })
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
