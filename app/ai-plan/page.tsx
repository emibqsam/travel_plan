import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { PlaceholderPage } from "@/app/components/PlaceholderPage";

export const dynamic = "force-dynamic";

export default async function AiPlanPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return (
    <PlaceholderPage
      title="AI 추천 여행 계획"
      description="목적지와 기간을 입력하면 AI가 일정을 자동 생성합니다."
    />
  );
}
