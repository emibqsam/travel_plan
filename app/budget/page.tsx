import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { PlaceholderPage } from "@/app/components/PlaceholderPage";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return (
    <PlaceholderPage
      title="예산 트래킹"
      description="여행별 지출을 카테고리로 기록하고 합계를 확인합니다."
    />
  );
}
