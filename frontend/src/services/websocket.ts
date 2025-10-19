import { api } from './api'

export interface WebSocketMessage {
  type: string
  [key: string]: any
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification'
  id: number
  title: string
  content: string
  notification_type: string
  priority: string
  icon?: string
  action_url?: string
  created_at: string
}

export interface AchievementMessage extends WebSocketMessage {
  type: 'achievement'
  achievement_id: number
  name: string
  description: string
  badge_icon: string
  points: number
}

export interface ChallengeUpdateMessage extends WebSocketMessage {
  type: 'challenge_update'
  challenge_id: number
  challenge_name: string
  progress: number
  status: string
}

export interface ClimateAlertMessage extends WebSocketMessage {
  type: 'climate_alert'
  alert_id: number
  title: string
  description: string
  severity: string
  location: string
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 5000
  private listeners: Map<string, Function[]> = new Map()
  private isConnecting = false

  connect(token: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true
    
    try {
      const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.isConnecting = false
        this.emit('disconnected')
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(token)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        this.emit('error', error)
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      this.isConnecting = false
    }
  }

  private scheduleReconnect(token: string) {
    this.reconnectAttempts++
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
    
    setTimeout(() => {
      this.connect(token)
    }, this.reconnectInterval * this.reconnectAttempts)
  }

  private handleMessage(message: WebSocketMessage) {
    const { type } = message
    
    switch (type) {
      case 'notification':
        this.emit('notification', message as NotificationMessage)
        break
      case 'achievement':
        this.emit('achievement', message as AchievementMessage)
        break
      case 'challenge_update':
        this.emit('challenge_update', message as ChallengeUpdateMessage)
        break
      case 'climate_alert':
        this.emit('climate_alert', message as ClimateAlertMessage)
        break
      case 'connection_established':
        this.emit('connection_established', message)
        break
      case 'pong':
        this.emit('pong', message)
        break
      default:
        console.log('Unknown message type:', type)
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  ping() {
    this.send({
      type: 'ping',
      timestamp: Date.now()
    })
  }

  markNotificationAsRead(notificationId: number) {
    this.send({
      type: 'mark_notification_read',
      notification_id: notificationId
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }

  // Event emitter functionality
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Export singleton instance
export const websocketService = new WebSocketService()
export default websocketService
