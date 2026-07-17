import { AuthLayout } from "@/components/layout/auth-layout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Create Account - AI Inventory Intelligence Platform",
  description: "Create a secure account for the AI Inventory Intelligence Platform.",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
