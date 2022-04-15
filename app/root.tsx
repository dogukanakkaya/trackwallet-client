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
import { Header } from './components/header';
import { getUserFromRequest } from './lib/auth/user.server';
import { API_GATEWAY_URL } from './config.server';
import { api } from './lib/axios';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Web of Crypto",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  api.interceptors.request.use((config) => {
    if (config.headers) {
      config.headers['Cookie'] = request.headers.get('Cookie') || '';
    }

    return config;
  });

  const user = await getUserFromRequest(request);

  return json({
    user,
    env: {
      API_GATEWAY_URL
    }
  }, {

  });
}

export default function App() {
  const { user, env } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider user={user}>
          <Header />
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
