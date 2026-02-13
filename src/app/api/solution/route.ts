import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { messageId } = body;

        if (!messageId) {
            return NextResponse.json(
                { detail: 'Message ID required' },
                { status: 400 }
            );
        }

        // Prepare headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (BACKEND_API_KEY) {
            headers['X-API-Key'] = BACKEND_API_KEY;
        }

        const backendBody = {
            message_id: messageId,
            user_id: session.user.id,
            feedback: 'solution',
            timestamp: new Date().toISOString(),
        };

        // Forward to backend
        // Assuming POST /feedback endpoint as placeholder
        const response = await fetch(`${BACKEND_URL}/feedback`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(backendBody),
        });

        if (!response.ok) {
            // Log but don't crash frontend if backend endpoint doesn't exist yet
            console.warn(`Backend feedback endpoint failed: ${response.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback error:', error);
        return NextResponse.json(
            { detail: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
