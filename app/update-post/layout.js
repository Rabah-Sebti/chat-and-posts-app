import { Suspense } from "react";

export const metadata = {
  title: "We Talk",
  description: "App foo chat and posts",
  icons: {
    icon: "/logo3.png",
  },
};

export default async function Layout({ children }) {
  return <Suspense>{children}</Suspense>;
}
