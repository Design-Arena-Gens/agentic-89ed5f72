import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Adalberto Alves - Personal Dog Training',
  description: 'Plataforma de compartilhamento de fotos e vídeos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
