import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Extrae el header x-signature
    const xSignature = req.headers.get('x-signature');
    const xRequestId = req.headers.get('x-request-id');
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    
    if (!xSignature || !xRequestId || !secret) {
      return NextResponse.json({ message: 'Missing required headers or secret' }, { status: 400 });
    }

    // Extrae data.id desde los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const dataId = searchParams.get('data.id');
    
    if (!dataId) {
      return NextResponse.json({ message: 'Missing data.id parameter' }, { status: 400 });
    }

    // Divide el valor de x-signature en sus partes ts y hash
    const parts = xSignature.split(',');
    let ts = '';
    let hash = '';

    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        if (key.trim() === 'ts') ts = value.trim();
        if (key.trim() === 'v1') hash = value.trim();
      }
    });

    if (!ts || !hash) {
      return NextResponse.json({ message: 'Invalid x-signature format' }, { status: 400 });
    }

    // Genera la plantilla para el HMAC
    const signatureTemplate = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Calcula el HMAC usando SHA256 con el secreto
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(signatureTemplate)
      .digest('hex');

    // Compara el HMAC generado con el hash recibido
    if (computedSignature !== hash) {
      return NextResponse.json({ message: 'Signature verification failed' }, { status: 403 });
    }

    // La firma es válida, procesa la notificación
    const notification = await req.json();
    console.log("Notificación recibida:", notification);

    // Responde con 200 para confirmar la recepción
    return NextResponse.json({ message: "Notificación recibida y validada" }, { status: 200 });
    
  } catch (error) {
    console.error("Error al procesar la notificación de Mercado Pago:", error);
    return NextResponse.json({ message: "Error al procesar la notificación" }, { status: 500 });
  }
}
