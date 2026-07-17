import { AuthLayout } from "@/components/layout/auth-layout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout eyebrow="Secure Password Reset">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
