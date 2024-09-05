import "./globals.css";
import { AuthProvider } from "@auth/JwtContext";
import { SocketProvider } from "@providers/socket-provider";
import { Toaster } from "@components/ui/sonner";
import StoreProvider from "@/providers/StoreProvider";

export const metadata = {
  title: "Convo Stream",
  description: "App for chat and share posts with friends",
  icons: {
    icon: "/logo3.png",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
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
