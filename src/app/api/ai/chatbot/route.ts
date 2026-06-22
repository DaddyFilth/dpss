import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { aiChatbot } from '@/lib/ai/chatbot';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'chatbot', 30, 60000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { userId, message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Generate AI response
    const response = await aiChatbot.processMessage(userId || 'anonymous', message);

    return NextResponse.json(
      {
        response,
        timestamp: new Date().toISOString(),
        aiPowered: true
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Chatbot error');
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}