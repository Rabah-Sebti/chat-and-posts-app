import GuestGuard from "@auth/GuestGuard";
import Register from "@components/Register";

const RegisterPage = () => {
  return (
    <GuestGuard>
      <Register />
    </GuestGuard>
  );
};

export default RegisterPage;
