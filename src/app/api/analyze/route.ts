import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/llm";
import { AnalysisRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalysisRequest = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required." },
        { status: 400 }
      );
    }

    const result = await analyzeResume(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze resume.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
