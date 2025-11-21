import { AnalysisResult } from "@/types";
import { getGroqCompletion } from "./groq";

export async function analyzeResume(resume: string, jd: string): Promise<AnalysisResult> {
  const systemPrompt = `
    You are an expert ATS Resume Optimizer. Your goal is to analyze a resume against a job description and provide actionable feedback, a fixed version of the resume, AND a hypothetical "Ideal Candidate" resume.
    
    Return your response in the following format:
    
    {
      "score": <number 0-100>,
      "missingSkills": ["skill1", "skill2", ...],
      "suggestions": ["suggestion1", "suggestion2", ...]
    }
    ---RESUME---
    <Full Markdown content of the fixed/optimized resume>
    ---IDEAL---
    <Full Markdown content of a hypothetical ideal candidate's resume that would score 100% for this JD>
    
    IMPORTANT:
    1. The JSON part must be valid JSON.
    2. The Fixed Resume must be a complete rewrite of the user's resume, optimized for the JD.
    3. The Ideal Resume must be a completely new, made-up resume that perfectly matches the JD requirements.
    4. Use the delimiters exactly as shown: ---RESUME--- and ---IDEAL---.
    `;

  try {
    const completion = await getGroqCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Resume:\n${resume}\n\nJob Description:\n${jd}` },
    ]);

    const content = completion.choices[0]?.message?.content || "";

    // Parse the response
    const parts = content.split('---RESUME---');
    const jsonPart = parts[0];
    const rest = parts[1] || "";

    const resumeParts = rest.split('---IDEAL---');
    let fixedResume = resumeParts[0] ? resumeParts[0].trim() : "";
    let idealResume = resumeParts[1] ? resumeParts[1].trim() : "";

    // Fallback if delimiters are missing or malformed
    if (!fixedResume) {
      // Try to find markdown content if delimiter failed
      const markdownMatch = content.match(/#\s.+/);
      if (markdownMatch) {
        fixedResume = content.substring(markdownMatch.index!);
      } else {
        fixedResume = "Could not generate fixed resume. Please try again.";
      }
    }

    if (!idealResume) {
      idealResume = "Could not generate ideal resume.";
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonPart);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      // Attempt to extract JSON from the beginning
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0]);
        } catch {
          analysis = { score: 0, missingSkills: [], suggestions: ["Error parsing AI response"] };
        }
      } else {
        analysis = { score: 0, missingSkills: [], suggestions: ["Error parsing AI response"] };
      }
    }

    return {
      score: analysis.score || 0,
      missingSkills: analysis.missingSkills || [],
      suggestions: analysis.suggestions || [],
      fixedResume,
      idealResume
    };
  } catch (error) {
    console.error("Error calling Groq:", error);
    throw error; // Re-throw to be caught by the API route
  }
}
