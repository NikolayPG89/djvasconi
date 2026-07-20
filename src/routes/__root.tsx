import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страницата не е намерена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Страницата, която търсите, не съществува или е преместена.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Към началото
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Страницата не се зареди
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Нещо се обърка. Опитайте да презаредите или се върнете към началото.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Опитай отново
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Към началото
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
      { title: "DJ Vasconi — Професионален DJ за сватби, клубове и събития в България" },
      { name: "description", content: "DJ Vasconi — професионален DJ в България за сватби, корпоративни събития, клубове и фестивали. Поп-фолк, балкански хитове, ориенталска, фолклор, сръбска, гръцка и ретро балкан." },
      { name: "author", content: "DJ Vasconi" },
      { property: "og:title", content: "DJ Vasconi — Професионален DJ за сватби, клубове и събития в България" },
      { property: "og:description", content: "DJ Vasconi — професионален DJ в България за сватби, корпоративни събития, клубове и фестивали. Поп-фолк, балкански хитове, ориенталска, фолклор, сръбска, гръцка и ретро балкан." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "bg_BG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DJ Vasconi — Професионален DJ за сватби, клубове и събития в България" },
      { name: "twitter:description", content: "DJ Vasconi — професионален DJ в България за сватби, корпоративни събития, клубове и фестивали. Поп-фолк, балкански хитове, ориенталска, фолклор, сръбска, гръцка и ретро балкан." },
      { property: "og:url", content: "https://night-vibe-showcase.lovable.app/" },
      { name: "twitter:site", content: "@djvasconi" },
      { property: "og:image", content: "https://night-vibe-showcase.lovable.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "1200" },
      { property: "og:image:alt", content: "DJ Vasconi — Професионален DJ за сватби, клубове и събития в България" },
      { name: "twitter:image", content: "https://night-vibe-showcase.lovable.app/og-image.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DJ Vasconi",
          alternateName: "DJ Васкони",
          url: "https://night-vibe-showcase.lovable.app/",
          email: "service@djvasconi.bg",
          telephone: "+359-877-333-500",
          address: {
            "@type": "PostalAddress",
            addressCountry: "BG",
            addressLocality: "София",
          },
          sameAs: [
            "https://instagram.com/djvasconi",
            "https://facebook.com/djvasconiofficial",
            "https://tiktok.com/@djvasconi",
          ],
          description: "DJ Vasconi — професионален DJ в България за сватби, корпоративни събития, клубове и фестивали. Поп-фолк, балкански хитове, ориенталска, фолклор, сръбска, гръцка и ретро балкан.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bg">
      <head>
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
