import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image, description } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "이미지가 필요합니다" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mediaType = image.match(/data:(image\/\w+);/)?.[1] ?? "image/jpeg";

    const prompt = `당신은 한국 전통 수리 공예 전문가 AI입니다. 업로드된 파손된 물건 사진을 분석하고 최적의 전통 수리 기법을 추천해주세요.

${description ? `사용자 추가 설명: ${description}` : ""}

다음 JSON 형식으로 정확히 응답해주세요 (다른 텍스트 없이 JSON만):
{
  "damageType": "파손 유형 (예: 선형 균열, 파편 결손, 표면 긁힘)",
  "severity": "심각도 (예: 경미 (1/5), 중간 (3/5), 심각 (5/5))",
  "material": "재질 (예: 백자 도자기, 청자, 목기, 옻칠 가구)",
  "recommendedTechnique": "추천 수리 기법 이름 (예: 금계 기법, 나전칠기, 옻칠 메움)",
  "techniqueDescription": "기법에 대한 2~3문장 설명",
  "steps": ["단계1", "단계2", "단계3", "단계4", "단계5"],
  "estimatedTime": "예상 소요 기간 (예: 2~3일)",
  "difficulty": "난이도 (예: 초급, 초급~중급, 중급, 고급)",
  "carbonSaved": 탄소절감량_숫자_kg,
  "previewDescription": "수리 후 예상 모습 설명 1~2문장",
  "materials": ["재료1", "재료2", "재료3", "재료4", "재료5"]
}`;

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: base64Data,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "분석 결과를 파싱할 수 없습니다" }, { status: 500 });
  } catch (error) {
    console.error("분석 오류:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다" }, { status: 500 });
  }
}
