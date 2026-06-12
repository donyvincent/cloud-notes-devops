import json
from groq import AsyncGroq
from app.config import settings

client = AsyncGroq(api_key=settings.groq_api_key)
MODEL = "llama-3.3-70b-versatile"


async def voice_to_structured_note(raw_text: str) -> dict:
    """Convert raw voice/brain-dump text into a clean structured note."""
    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": (
                    "You are an expert note organizer. Convert this raw voice transcription or brain-dump "
                    "into a clean, well-structured note. Return a JSON object with these exact keys:\n"
                    '- "title": a concise title (max 10 words)\n'
                    '- "content": the full structured note in markdown with headings (##), bullets (- ), '
                    "and a ## Action Items section if any tasks were mentioned\n"
                    '- "tags": comma-separated topic tags (max 5)\n\n'
                    f"Raw input:\n{raw_text}\n\n"
                    "Return ONLY valid JSON."
                ),
            }
        ],
    )
    text = response.choices[0].message.content.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {"title": "Untitled Note", "content": raw_text, "tags": ""}


async def debate_mode(note_content: str, position: str) -> dict:
    """Generate a rigorous counter-argument against the given position."""
    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": (
                    "You are a rigorous intellectual devil's advocate. Your job is to stress-test ideas.\n\n"
                    f"Note context:\n{note_content}\n\n"
                    f"Position to challenge: {position}\n\n"
                    "Return a JSON object with these exact keys:\n"
                    '- "original_position": restate the position clearly\n'
                    '- "counter_argument": a thorough, well-reasoned opposing argument (2-3 paragraphs)\n'
                    '- "key_weaknesses": list of 3-5 specific logical/empirical weaknesses in the original position\n'
                    '- "steelman": the strongest possible version of the original position you can construct\n\n'
                    "Return ONLY valid JSON."
                ),
            }
        ],
    )
    text = response.choices[0].message.content.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {
            "original_position": position,
            "counter_argument": "Unable to generate counter-argument.",
            "key_weaknesses": [],
            "steelman": position,
        }


async def generate_graph_relationships(notes: list[dict]) -> list[dict]:
    """Use Groq to identify meaningful relationships between notes for the knowledge graph."""
    if len(notes) < 2:
        return []

    notes_summary = "\n".join(
        [f"[ID:{n['id']}] {n['title']}: {n['content'][:200]}" for n in notes[:20]]
    )

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": (
                    "Analyze these notes and identify meaningful conceptual relationships between them. "
                    "Return a JSON array of relationship objects. Each object must have:\n"
                    '- "source_id": integer note ID\n'
                    '- "target_id": integer note ID\n'
                    '- "similarity": float 0.0-1.0 (how strongly related)\n'
                    '- "relationship": short label like "supports", "contradicts", "extends", "references"\n\n'
                    "Only include relationships with similarity > 0.4. Max 15 relationships.\n\n"
                    f"Notes:\n{notes_summary}\n\n"
                    "Return ONLY a valid JSON array."
                ),
            }
        ],
    )
    text = response.choices[0].message.content.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return []
