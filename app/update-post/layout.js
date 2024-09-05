import { Suspense } from "react";

export const metadata = {
  title: "Convo Stream",
  description: "App for chat and share posts with friends",

  icons: {
    icon: "/logo3.png",
  },
};

export default async function Layout({ children }) {
  return <Suspense>{children}</Suspense>;
}
