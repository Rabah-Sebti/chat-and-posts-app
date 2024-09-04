import Login from "@components/Login";
import GuestGuard from "@auth/GuestGuard";

const LoginPage = () => {
  return (
    <GuestGuard>
      <Login />
    </GuestGuard>
  );
};

export default LoginPage;
