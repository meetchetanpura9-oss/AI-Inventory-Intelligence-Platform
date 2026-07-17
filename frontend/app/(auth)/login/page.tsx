import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/features/auth/components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{
    force?: string | string[];
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const force = Array.isArray(params.force) ? params.force[0] : params.force;

  return (
    <AuthLayout allowAuthenticated={force === "true"}>
      <LoginForm />
    </AuthLayout>
  );
}
