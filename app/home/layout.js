import AuthGuard from "@auth/AuthGuard";
import Nav from "@components/Nav";

export const metadata = {
  title: "We Talk",
  description: "App foo chat and posts",
  icons: {
    icon: "/logo3.png",
  },
};

export default async function Layout({ children }) {
  return (
    <>
      <AuthGuard>
        <Nav />
        {children}
      </AuthGuard>
    </>
  );
}
