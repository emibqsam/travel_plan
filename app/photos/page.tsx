import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { PlaceholderPage } from "@/app/components/PlaceholderPage";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return (
    <PlaceholderPage
      title="사진 / 메모 기록"
      description="여행 중 찍은 사진과 메모를 한 곳에 모아둡니다."
    />
  );
}
