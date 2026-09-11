import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Rafraîchit la session Supabase et protège /admin.
 *
 * Le middleware est une PREMIÈRE barrière, pas la seule : chaque page
 * d'administration revérifie la session côté serveur. Se reposer
 * uniquement sur un middleware serait une erreur de conception.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sans configuration, l'administration reste inaccessible plutôt
  // qu'ouverte : on échoue du côté sûr.
  if (!url || !key) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const target = request.nextUrl.clone();
      target.pathname = '/admin/connexion';
      target.searchParams.set('erreur', 'configuration');
      return request.nextUrl.pathname === '/admin/connexion'
        ? response
        : NextResponse.redirect(target);
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  // getUser() revalide le jeton auprès de Supabase.
  // getSession() se contenterait de lire un cookie — insuffisant ici.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/connexion';
  const isAdminArea = pathname.startsWith('/admin');

  if (isAdminArea && !isLoginPage && !user) {
    const target = request.nextUrl.clone();
    target.pathname = '/admin/connexion';
    target.search = '';
    return NextResponse.redirect(target);
  }

  if (isLoginPage && user) {
    const target = request.nextUrl.clone();
    target.pathname = '/admin';
    target.search = '';
    return NextResponse.redirect(target);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf les ressources statiques et les fichiers
     * d'images, pour lesquels la session n'a pas d'intérêt.
     */
    '/((?!_next/static|_next/image|favicon.ico|brand/|images/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?)$).*)',
  ],
};
