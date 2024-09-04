import "./globals.css";
import { AuthProvider } from "@auth/JwtContext";
// import StoreProvider from "./StoreProvider";
import { SocketProvider } from "@providers/socket-provider";
import { Toaster } from "@components/ui/sonner";
import StoreProvider from "@/providers/StoreProvider";

export const metadata = {
  title: "We Talk",
  description: "App foo chat and posts",
  icons: {
    icon: "/logo3.png",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="icon" href="./favicon.ico" sizes="32x32" />
      </head> */}
      <body>
        <AuthProvider>
          <StoreProvider>
            <SocketProvider>
              <main className="">{children}</main>
              <Toaster />
            </SocketProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
