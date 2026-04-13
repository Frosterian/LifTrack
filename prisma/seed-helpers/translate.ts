import OpenAI from "openai";

export async function translateNamesFR(names: string[]): Promise<Record<string, string>> {
  if (!process.env.OPENAI_API_KEY) {
    console.log("⚠️  OPENAI_API_KEY non set — traduction skip");
    return {};
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const result: Record<string, string> = {};
  const CHUNK = 80;

  for (let i = 0; i < names.length; i += CHUNK) {
    const batch = names.slice(i, i + CHUNK);
    console.log(`  Traduction batch ${i / CHUNK + 1}/${Math.ceil(names.length / CHUNK)} (${batch.length} noms)`);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Tu traduis des noms d'exercices de musculation de l'anglais vers le français. " +
              "Réponds avec un JSON object dont les clés sont les noms anglais EXACTS reçus, " +
              "et les valeurs sont les traductions françaises courtes et naturelles utilisées en salle.",
          },
          {
            role: "user",
            content: JSON.stringify({ names: batch }),
          },
        ],
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) continue;
      const parsed = JSON.parse(content);
      const translations = parsed.translations ?? parsed;
      for (const [en, fr] of Object.entries(translations)) {
        if (typeof fr === "string" && fr.trim()) result[en] = fr.trim();
      }
    } catch (err) {
      console.log(`  ⚠️  batch failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`  ✓ ${Object.keys(result).length}/${names.length} traductions OK`);
  return result;
}
