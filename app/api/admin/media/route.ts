import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Mock database
let media = [
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

export async function GET() {
  return NextResponse.json(media)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newMedia = {
      id: uuidv4(),
      ...data
    }

    media.push(newMedia)

    return NextResponse.json(newMedia, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}
