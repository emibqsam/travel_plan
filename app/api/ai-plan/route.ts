import { NextResponse } from "next/server";
import OpenAI from "openai";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PlanItem {
  start_time: string;
  place: string;
  memo: string;
}

interface PlanDay {
  day_number: number;
  items: PlanItem[];
}

export interface AiPlanResult {
  title: string;
  summary: string;
  days: PlanDay[];
}

const responseSchema = {
  name: "travel_plan",
  schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "여행 제목 (한국어, 30자 이내)" },
      summary: { type: "string", description: "여행 컨셉 1-2문장" },
      days: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day_number: { type: "integer", minimum: 1 },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  start_time: {
                    type: "string",
                    description: "HH:MM 24시간 표기 (예: 09:30)",
                  },
                  place: { type: "string", description: "장소명 (한국어)" },
                  memo: { type: "string", description: "활동/팁 1문장" },
                },
                required: ["start_time", "place", "memo"],
                additionalProperties: false,
              },
            },
          },
          required: ["day_number", "items"],
          additionalProperties: false,
        },
      },
    },
    required: ["title", "summary", "days"],
    additionalProperties: false,
  },
  strict: true,
};

function diffDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const body: ApiResponse = {
      success: false,
      error: "OPENAI_API_KEY가 설정되지 않았습니다",
    };
    return NextResponse.json(body, { status: 500 });
  }

  const payload = await request.json().catch(() => null);
  const destination =
    typeof payload?.destination === "string" ? payload.destination.trim() : "";
  const start_date = payload?.start_date;
  const end_date = payload?.end_date;
  const style =
    typeof payload?.style === "string" ? payload.style.trim() : "";
  const party_size = Number(payload?.party_size) || 1;

  if (!destination || !start_date || !end_date) {
    const body: ApiResponse = {
      success: false,
      error: "destination, start_date, end_date 필수",
    };
    return NextResponse.json(body, { status: 400 });
  }
  const days = diffDays(start_date, end_date);
  if (days < 1 || days > 14) {
    const body: ApiResponse = {
      success: false,
      error: "여행 기간은 1~14일 사이여야 합니다",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  const userPrompt = [
    `목적지: ${destination}`,
    `여행 기간: ${start_date} ~ ${end_date} (총 ${days}일)`,
    `인원: ${party_size}명`,
    style ? `스타일/관심사: ${style}` : "",
    "",
    "위 조건에 맞는 일자별 여행 계획을 짜줘.",
    "각 일자(day_number=1..N)마다 4~6개의 활동을 시간 순서대로 배치해.",
    "place는 실제 존재할 법한 구체적 장소명, memo는 활동 한 줄 설명.",
    "이동 동선과 식사 시간(점심·저녁)을 자연스럽게 포함시켜.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "너는 한국어로 답하는 여행 플래너야. 반드시 JSON 스키마를 따라 응답해.",
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_schema", json_schema: responseSchema },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      const body: ApiResponse = {
        success: false,
        error: "AI 응답이 비어있습니다",
      };
      return NextResponse.json(body, { status: 502 });
    }

    const parsed = JSON.parse(content) as AiPlanResult;
    const body: ApiResponse<AiPlanResult> = { success: true, data: parsed };
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI 호출 실패";
    const body: ApiResponse = { success: false, error: message };
    return NextResponse.json(body, { status: 500 });
  }
}
