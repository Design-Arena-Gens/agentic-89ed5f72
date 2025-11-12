'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Media {
  id: string
  type: 'image' | 'video'
  url: string
  title: string
  uploadDate: string
}

interface Notification {
  id: string
  message: string
  date: string
  type: 'info' | 'payment' | 'media'
  read: boolean
}

export default function ClientDashboard() {
  const router = useRouter()
  const [media, setMedia] = useState<Media[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')

    if (!token || role !== 'client') {
      router.push('/')
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const [mediaRes, notificationsRes] = await Promise.all([
        fetch(`/api/client/media?userId=${userId}`),
        fetch(`/api/client/notifications?userId=${userId}`)
      ])

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json()
        setMedia(mediaData)
      }

      if (notificationsRes.ok) {
        const notifData = await notificationsRes.json()
        setNotifications(notifData)
        setUnreadCount(notifData.filter((n: Notification) => !n.read).length)
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/client/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
      fetchData()
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-orange))',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '15px',
        boxShadow: '0 4px 20px rgba(0, 243, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#00f3ff'
          }}>
            AA
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adalberto Alves
            </h1>
            <p style={{ fontSize: '14px', color: 'white', margin: '2px 0 0 0' }}>
              Personal Dog Training
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '10px 15px',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--neon-orange)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="button-neon"
            style={{ padding: '10px 20px', borderRadius: '8px' }}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Notifications Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--neon-blue)', fontSize: '24px', marginBottom: '15px' }}>
            🔔 Notificações
          </h2>
          {notifications.length === 0 ? (
            <div style={{
              background: 'var(--card-bg)',
              padding: '20px',
              borderRadius: '10px',
              border: '2px solid var(--neon-blue)',
              textAlign: 'center',
              color: '#888'
            }}>
              Nenhuma notificação no momento
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  style={{
                    background: notif.read ? 'var(--card-bg)' : 'rgba(0, 243, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: `2px solid ${notif.read ? 'var(--neon-blue)' : 'var(--neon-orange)'}`,
                    boxShadow: notif.read ? '0 0 15px rgba(0, 243, 255, 0.2)' : '0 0 20px rgba(255, 107, 0, 0.3)',
                    cursor: notif.read ? 'default' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{notif.message}</p>
                      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                        {new Date(notif.date).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        background: notif.type === 'payment' ? 'rgba(255, 107, 0, 0.2)' : 'rgba(0, 243, 255, 0.2)',
                        border: `1px solid ${notif.type === 'payment' ? 'var(--neon-orange)' : 'var(--neon-blue)'}`,
                        whiteSpace: 'nowrap'
                      }}>
                        {notif.type === 'info' && 'ℹ️'}
                        {notif.type === 'payment' && '💰'}
                        {notif.type === 'media' && '📸'}
                      </span>
                      {!notif.read && (
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'var(--neon-orange)',
                          boxShadow: '0 0 10px var(--neon-orange)'
                        }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Gallery */}
        <div>
          <h2 style={{ color: 'var(--neon-blue)', fontSize: '24px', marginBottom: '15px' }}>
            📸 Fotos e Vídeos
          </h2>
          {media.length === 0 ? (
            <div style={{
              background: 'var(--card-bg)',
              padding: '40px',
              borderRadius: '10px',
              border: '2px solid var(--neon-blue)',
              textAlign: 'center',
              color: '#888'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>📷</p>
              <p>Nenhuma foto ou vídeo disponível ainda</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {media.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  style={{
                    background: 'var(--card-bg)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid var(--neon-blue)',
                    boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#0a0a0a',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    fontSize: '64px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {item.type === 'image' ? '📷' : '🎥'}
                  </div>
                  <h4 style={{ color: 'var(--neon-orange)', marginBottom: '5px', fontSize: '16px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                    {new Date(item.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg)',
              padding: '30px',
              borderRadius: '15px',
              border: '2px solid var(--neon-blue)',
              boxShadow: '0 0 50px rgba(0, 243, 255, 0.5)',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: 'var(--neon-orange)', fontSize: '24px', margin: '0 0 10px 0' }}>
                  {selectedMedia.title}
                </h3>
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
                  {new Date(selectedMedia.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                style={{
                  background: 'transparent',
                  border: '2px solid var(--neon-orange)',
                  color: 'var(--neon-orange)',
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            <div style={{
              width: '100%',
              minHeight: '400px',
              background: '#0a0a0a',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '128px'
            }}>
              {selectedMedia.type === 'image' ? '📷' : '🎥'}
            </div>
            <p style={{ marginTop: '15px', color: '#888', fontSize: '14px', textAlign: 'center' }}>
              URL: {selectedMedia.url}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
