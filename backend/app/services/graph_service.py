from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.note import Note
from app.services.claude_service import generate_graph_relationships


async def build_knowledge_graph(db: AsyncSession) -> dict:
    result = await db.execute(select(Note).order_by(Note.updated_at.desc()).limit(50))
    notes = result.scalars().all()

    if not notes:
        return {"nodes": [], "edges": []}

    notes_data = [
        {"id": n.id, "title": n.title, "content": n.content, "tags": n.tags}
        for n in notes
    ]

    edges = await generate_graph_relationships(notes_data)

    node_ids_in_edges = set()
    for edge in edges:
        node_ids_in_edges.add(edge["source_id"])
        node_ids_in_edges.add(edge["target_id"])

    visible_notes = (
        [n for n in notes if n.id in node_ids_in_edges] if node_ids_in_edges else notes
    )

    return {"nodes": visible_notes, "edges": edges}
