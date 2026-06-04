import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Protocolo Soberano de Harmonia Quântica — Treinamento Empresarial, Ressonância Harmônica e Física Quântica" },
      { name: "description", content: "Protocolo Soberano de Harmonia Quântica: sistema operacional de treinamento empresarial baseado em ressonância harmônica, harmonia quântica, universo quântico e física quântica aplicada à performance executiva." },
      { name: "keywords", content: "treinamento empresarial, ressonância harmônica, harmonia quântica, universo quântico, física quântica, frequências binaurais, alta performance, mentalidade quântica, alinhamento executivo, neuroacústica, protocolo soberano" },
      { name: "author", content: "Instituto Venditti" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "Protocolo Soberano de Harmonia Quântica" },
      { property: "og:title", content: "Protocolo Soberano de Harmonia Quântica — Treinamento em Ressonância e Física Quântica" },
      { property: "og:description", content: "Treinamento empresarial em harmonia quântica, ressonância harmônica e física quântica aplicada. Clareza. Direção. Domínio." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Protocolo Soberano de Harmonia Quântica" },
      { name: "twitter:description", content: "Treinamento empresarial em ressonância harmônica e física quântica aplicada à performance." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Protocolo Soberano de Harmonia Quântica",
          url: "https://state-domain-protocol.lovable.app",
          description: "Treinamento empresarial em ressonância harmônica, harmonia quântica, universo quântico e física quântica aplicada à alta performance.",
          founder: { "@type": "Organization", name: "Instituto Venditti" },
          knowsAbout: [
            "Treinamento empresarial",
            "Ressonância harmônica",
            "Harmonia quântica",
            "Universo quântico",
            "Física quântica",
            "Frequências binaurais",
            "Alta performance executiva",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster theme="dark" position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
