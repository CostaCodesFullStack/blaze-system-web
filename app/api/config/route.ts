import { NextResponse } from "next/server";

let configs: any[] = []; // memória (temporario)

export async function POST(req: Request) {
    const body = await req.json();

    const existingIndex = configs.findIndex(
        (c) => c.guildId === body.guildId
    );

    if (existingIndex !== -1) {
        configs[existingIndex] = body; // Atualiza a configuração existente
    } else {
        configs.push(body); // Adiciona nova configuração
    }

    console.log("CONFIG SALVA: ", body);

    return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing id"}, { status: 400 });
    }

    const config = configs.find((c) => c.guildId === id);

    return NextResponse.json(config || null);
}
