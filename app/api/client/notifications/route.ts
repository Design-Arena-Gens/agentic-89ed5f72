import { NextResponse } from 'next/server'

// Mock data
const notifications = [
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
  },
  {
    id: 'n4',
    clientId: 'c1',
    message: 'Obrigado pelo pagamento! Seu plano está ativo.',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    type: 'payment' as 'info' | 'payment' | 'media',
    read: true
  }
]

// Map userId to clientId
const userClientMap: Record<string, string> = {
  '2': 'c1'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const clientId = userClientMap[userId] || 'c1'
  const clientNotifications = notifications.filter(n => n.clientId === clientId)

  return NextResponse.json(clientNotifications)
}
