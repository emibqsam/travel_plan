import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { PlaceholderPage } from "@/app/components/PlaceholderPage";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return (
    <PlaceholderPage
      title="준비물 체크리스트"
      description="여행 전 챙겨야 할 항목을 체크리스트로 관리합니다."
    />
  );
}
