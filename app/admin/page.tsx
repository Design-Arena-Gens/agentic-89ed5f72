'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  email: string
  dogName: string
  phone: string
  plan: string
  status: string
  paymentStatus: string
  lastPaymentDate?: string
}

interface Media {
  id: string
  clientId: string
  type: 'image' | 'video'
  url: string
  title: string
  uploadDate: string
}

interface Notification {
  id: string
  clientId: string
  message: string
  date: string
  type: 'info' | 'payment' | 'media'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'clients' | 'media' | 'notifications' | 'payments'>('clients')
  const [clients, setClients] = useState<Client[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showAddClient, setShowAddClient] = useState(false)
  const [showUploadMedia, setShowUploadMedia] = useState(false)
  const [showSendNotification, setShowSendNotification] = useState(false)

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    dogName: '',
    phone: '',
    plan: 'basic',
    status: 'active'
  })

  const [newMedia, setNewMedia] = useState({
    clientId: '',
    type: 'image' as 'image' | 'video',
    url: '',
    title: ''
  })

  const [newNotification, setNewNotification] = useState({
    clientId: '',
    message: '',
    type: 'info' as 'info' | 'payment' | 'media'
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')

    if (!token || role !== 'admin') {
      router.push('/')
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [clientsRes, mediaRes, notificationsRes] = await Promise.all([
        fetch('/api/admin/clients'),
        fetch('/api/admin/media'),
        fetch('/api/admin/notifications')
      ])

      if (clientsRes.ok) setClients(await clientsRes.json())
      if (mediaRes.ok) setMedia(await mediaRes.json())
      if (notificationsRes.ok) setNotifications(await notificationsRes.json())
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      })

      if (response.ok) {
        fetchData()
        setShowAddClient(false)
        setNewClient({ name: '', email: '', dogName: '', phone: '', plan: 'basic', status: 'active' })
      }
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err)
    }
  }

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMedia, uploadDate: new Date().toISOString() })
      })

      if (response.ok) {
        fetchData()
        setShowUploadMedia(false)
        setNewMedia({ clientId: '', type: 'image', url: '', title: '' })
      }
    } catch (err) {
      console.error('Erro ao fazer upload:', err)
    }
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newNotification, date: new Date().toISOString() })
      })

      if (response.ok) {
        fetchData()
        setShowSendNotification(false)
        setNewNotification({ clientId: '', message: '', type: 'info' })
      }
    } catch (err) {
      console.error('Erro ao enviar notificação:', err)
    }
  }

  const handleMarkPayment = async (clientId: string) => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, date: new Date().toISOString() })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (err) {
      console.error('Erro ao registrar pagamento:', err)
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
              Personal Dog Training - Admin
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="button-neon"
          style={{ padding: '10px 20px', borderRadius: '8px' }}
        >
          Sair
        </button>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '20px',
        overflowX: 'auto',
        background: 'var(--card-bg)',
        borderBottom: '2px solid var(--neon-blue)'
      }}>
        {(['clients', 'media', 'notifications', 'payments'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="button-neon"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              opacity: activeTab === tab ? 1 : 0.6,
              whiteSpace: 'nowrap'
            }}
          >
            {tab === 'clients' && '👥 Clientes'}
            {tab === 'media' && '📸 Mídia'}
            {tab === 'notifications' && '🔔 Notificações'}
            {tab === 'payments' && '💰 Pagamentos'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--neon-blue)', fontSize: '24px' }}>Gerenciar Clientes</h2>
              <button
                onClick={() => setShowAddClient(!showAddClient)}
                className="button-neon"
                style={{ padding: '10px 20px', borderRadius: '8px' }}
              >
                ➕ Adicionar Cliente
              </button>
            </div>

            {showAddClient && (
              <form onSubmit={handleAddClient} style={{
                background: 'var(--card-bg)',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '2px solid var(--neon-blue)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newClient.name}
                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Nome do Cachorro"
                    value={newClient.dogName}
                    onChange={e => setNewClient({ ...newClient, dogName: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  />
                  <select
                    value={newClient.plan}
                    onChange={e => setNewClient({ ...newClient, plan: e.target.value })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  >
                    <option value="basic">Básico</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="button-neon"
                  style={{ padding: '10px 20px', borderRadius: '8px', marginTop: '15px' }}
                >
                  Salvar Cliente
                </button>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {clients.map(client => (
                <div key={client.id} style={{
                  background: 'var(--card-bg)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid var(--neon-blue)',
                  boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
                }}>
                  <h3 style={{ color: 'var(--neon-orange)', marginBottom: '10px' }}>{client.name}</h3>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>🐕 {client.dogName}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>📧 {client.email}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>📱 {client.phone}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>📦 Plano: {client.plan}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    💰 Pagamento: <span style={{ color: client.paymentStatus === 'paid' ? '#4ade80' : '#f87171' }}>
                      {client.paymentStatus === 'paid' ? 'Em dia' : 'Pendente'}
                    </span>
                  </p>
                  <button
                    onClick={() => handleMarkPayment(client.id)}
                    className="button-neon"
                    style={{ padding: '8px 16px', borderRadius: '6px', marginTop: '10px', width: '100%' }}
                  >
                    Registrar Pagamento
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--neon-blue)', fontSize: '24px' }}>Compartilhar Fotos e Vídeos</h2>
              <button
                onClick={() => setShowUploadMedia(!showUploadMedia)}
                className="button-neon"
                style={{ padding: '10px 20px', borderRadius: '8px' }}
              >
                ➕ Upload Mídia
              </button>
            </div>

            {showUploadMedia && (
              <form onSubmit={handleUploadMedia} style={{
                background: 'var(--card-bg)',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '2px solid var(--neon-blue)'
              }}>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <select
                    value={newMedia.clientId}
                    onChange={e => setNewMedia({ ...newMedia, clientId: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  >
                    <option value="">Selecione o Cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name} - {client.dogName}</option>
                    ))}
                  </select>
                  <select
                    value={newMedia.type}
                    onChange={e => setNewMedia({ ...newMedia, type: e.target.value as 'image' | 'video' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  >
                    <option value="image">Foto</option>
                    <option value="video">Vídeo</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Título"
                    value={newMedia.title}
                    onChange={e => setNewMedia({ ...newMedia, title: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="URL da mídia"
                    value={newMedia.url}
                    onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="button-neon"
                  style={{ padding: '10px 20px', borderRadius: '8px', marginTop: '15px' }}
                >
                  Fazer Upload
                </button>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {media.map(item => (
                <div key={item.id} style={{
                  background: 'var(--card-bg)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '2px solid var(--neon-blue)',
                  boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
                }}>
                  <div style={{
                    width: '100%',
                    height: '150px',
                    background: '#0a0a0a',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    fontSize: '48px'
                  }}>
                    {item.type === 'image' ? '📷' : '🎥'}
                  </div>
                  <h4 style={{ color: 'var(--neon-orange)', marginBottom: '5px' }}>{item.title}</h4>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    Cliente: {clients.find(c => c.id === item.clientId)?.name || 'N/A'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    Data: {new Date(item.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--neon-blue)', fontSize: '24px' }}>Enviar Notificações</h2>
              <button
                onClick={() => setShowSendNotification(!showSendNotification)}
                className="button-neon"
                style={{ padding: '10px 20px', borderRadius: '8px' }}
              >
                ➕ Nova Notificação
              </button>
            </div>

            {showSendNotification && (
              <form onSubmit={handleSendNotification} style={{
                background: 'var(--card-bg)',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '2px solid var(--neon-blue)'
              }}>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <select
                    value={newNotification.clientId}
                    onChange={e => setNewNotification({ ...newNotification, clientId: e.target.value })}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  >
                    <option value="">Selecione o Cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  <select
                    value={newNotification.type}
                    onChange={e => setNewNotification({ ...newNotification, type: e.target.value as any })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white'
                    }}
                  >
                    <option value="info">Informação</option>
                    <option value="payment">Pagamento</option>
                    <option value="media">Nova Mídia</option>
                  </select>
                  <textarea
                    placeholder="Mensagem"
                    value={newNotification.message}
                    onChange={e => setNewNotification({ ...newNotification, message: e.target.value })}
                    required
                    rows={4}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--neon-blue)',
                      background: '#0a0a0a',
                      color: 'white',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="button-neon"
                  style={{ padding: '10px 20px', borderRadius: '8px', marginTop: '15px' }}
                >
                  Enviar Notificação
                </button>
              </form>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{
                  background: 'var(--card-bg)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '2px solid var(--neon-blue)',
                  boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ color: 'var(--neon-orange)', marginBottom: '5px' }}>
                        {clients.find(c => c.id === notif.clientId)?.name || 'N/A'}
                      </h4>
                      <p style={{ margin: '5px 0' }}>{notif.message}</p>
                      <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                        {new Date(notif.date).toLocaleString()}
                      </p>
                    </div>
                    <span style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      background: notif.type === 'payment' ? 'rgba(255, 107, 0, 0.2)' : 'rgba(0, 243, 255, 0.2)',
                      border: `1px solid ${notif.type === 'payment' ? 'var(--neon-orange)' : 'var(--neon-blue)'}`,
                      whiteSpace: 'nowrap'
                    }}>
                      {notif.type === 'info' && 'ℹ️ Info'}
                      {notif.type === 'payment' && '💰 Pagamento'}
                      {notif.type === 'media' && '📸 Mídia'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <h2 style={{ color: 'var(--neon-blue)', fontSize: '24px', marginBottom: '20px' }}>Comprovantes de Pagamento</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {clients.map(client => (
                <div key={client.id} style={{
                  background: 'var(--card-bg)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid var(--neon-blue)',
                  boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div>
                    <h3 style={{ color: 'var(--neon-orange)', marginBottom: '5px' }}>{client.name}</h3>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>Plano: {client.plan}</p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      Status: <span style={{ color: client.paymentStatus === 'paid' ? '#4ade80' : '#f87171' }}>
                        {client.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </p>
                    {client.lastPaymentDate && (
                      <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>
                        Último pagamento: {new Date(client.lastPaymentDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleMarkPayment(client.id)}
                    className="button-neon"
                    style={{ padding: '10px 20px', borderRadius: '8px' }}
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
