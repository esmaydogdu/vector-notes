import { NoteList, HeaderFilters } from "@/components";
import Link from "next/link";
import { getSignInUrl, getSignUpUrl, withAuth, signOut } from "@workos-inc/authkit-nextjs";

export default async function NotesPage() {
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();
  const { user } = await withAuth()
  console.log('>> user', user)
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
      <div className="flex">
        { user && (
          <>
          <form
            action={async () => { 
              'use server'; await signOut();
            }}
          >
            <p>Welcome back, {user.firstName}!</p>
            <button type="submit">Sign out</button>
          </form>
          <HeaderFilters />
          </>
        )}
      </div>
      {
        user ? (
          <>
            <div className="flex relative">
              <div className="flex-1 bg-gray-800 p-4 border-t-2 border-gray-400">
                <NoteList />
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href={signInUrl}>Sign in</Link>
            <Link href={signUpUrl}>Sign up</Link>
          </>
        )
      }
    </div>
  );
}
