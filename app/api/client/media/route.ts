import { NextResponse } from 'next/server'

// Mock data - same as admin but filtered by client
const media = [
  {
    id: 'm1',
    clientId: 'c1',
    type: 'image' as 'image' | 'video',
    url: 'https://example.com/image1.jpg',
    title: 'Treinamento de Rex - Semana 1',
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'm2',
    clientId: 'c1',
    type: 'video' as 'image' | 'video',
    url: 'https://example.com/video1.mp4',
    title: 'Rex aprendendo comandos básicos',
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'm3',
    clientId: 'c2',
    type: 'image' as 'image' | 'video',
    url: 'https://example.com/image2.jpg',
    title: 'Bella - Primeira sessão',
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'm4',
    clientId: 'c3',
    type: 'video' as 'image' | 'video',
    url: 'https://example.com/video2.mp4',
    title: 'Thor - Treino de agilidade',
    uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Map userId to clientId
const userClientMap: Record<string, string> = {
  '2': 'c1' // The demo client user maps to client c1
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Get client ID for this user
  const clientId = userClientMap[userId] || 'c1'

  // Filter media for this client
  const clientMedia = media.filter(m => m.clientId === clientId)

  return NextResponse.json(clientMedia)
}
