import { AuthLayout } from "@/components/layout/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout eyebrow="Account Recovery">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
