import { AuthLayout } from "@/components/layout/auth-layout";
import { RequestAccessForm } from "@/features/auth/components/RequestAccessForm";

export const metadata = {
  title: "Request Enterprise Access - AI Inventory Intelligence Platform",
  description: "Request secure enterprise credentials to access the AI supply chain command center.",
};

export default function RequestAccessPage() {
  return (
    <AuthLayout>
      <RequestAccessForm />
    </AuthLayout>
  );
}
