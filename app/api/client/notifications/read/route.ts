import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { notificationId } = await request.json()

    // In a real app, update the notification in the database
    // For this demo, we'll just return success

    return NextResponse.json({ success: true, notificationId })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao marcar notificação' },
      { status: 500 }
    )
  }
}
