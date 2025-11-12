import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Mock database
let notifications = [
  {
    id: 'n1',
    clientId: 'c1',
    message: 'Nova sessão agendada para sexta-feira às 14h',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'info' as 'info' | 'payment' | 'media',
    read: false
  },
  {
    id: 'n2',
    clientId: 'c2',
    message: 'Pagamento da mensalidade vencendo em 5 dias',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'payment' as 'info' | 'payment' | 'media',
    read: false
  },
  {
    id: 'n3',
    clientId: 'c3',
    message: 'Novas fotos do treinamento disponíveis!',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    type: 'media' as 'info' | 'payment' | 'media',
    read: false
  }
]

export async function GET() {
  return NextResponse.json(notifications)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newNotification = {
      id: uuidv4(),
      ...data,
      read: false
    }

    notifications.push(newNotification)

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao enviar notificação' },
      { status: 500 }
    )
  }
}
