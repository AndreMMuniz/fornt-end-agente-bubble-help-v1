import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Preparing headers for the backend
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // If we have an API Key configured, we send it
        if (BACKEND_API_KEY) {
            headers['X-API-Key'] = BACKEND_API_KEY;
        }

        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { detail: errorData.detail || 'Backend error' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { detail: 'Não foi possível conectar ao backend. Verifique se ele está rodando em ' + BACKEND_URL },
            { status: 503 }
        );
    }
}
