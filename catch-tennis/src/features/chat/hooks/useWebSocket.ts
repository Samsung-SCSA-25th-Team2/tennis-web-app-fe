import {useEffect, useRef, useState, useCallback} from 'react'
import {getChatWebSocketService, type ChatWebSocketMessage} from '../services/websocket'

export function useWebSocket(chatRoomId: number, onMessageReceived?: (message: ChatWebSocketMessage) => void) {
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const wsService = useRef(getChatWebSocketService())
    const unsubscribeRef = useRef<(() => void) | null>(null)
    const maxRetries = 3

    useEffect(() => {
        const service = wsService.current
        let retryTimeout: NodeJS.Timeout

        const connectAndSubscribe = async () => {
            try {
                // Connect if not already connected
                if (!service.isConnected()) {
                    await service.connect(
                        () => {
                            console.log('WebSocket connected')
                            setConnected(true)
                            setError(null)
                            setRetryCount(0)
                        },
                        (err) => {
                            // Only log actual connection errors, not subscription errors
                            if (!err.message.includes('Invalid destination')) {
                                console.warn('WebSocket connection error:', err.message)
                                setError(err)
                                setConnected(false)

                                // Retry connection with exponential backoff
                                if (retryCount < maxRetries) {
                                    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
                                    console.log(`Retrying WebSocket connection in ${delay}ms... (${retryCount + 1}/${maxRetries})`)
                                    retryTimeout = setTimeout(() => {
                                        setRetryCount(prev => prev + 1)
                                    }, delay)
                                } else {
                                    console.warn('WebSocket: Max retries reached. Operating in REST-only mode.')
                                }
                            }
                        }
                    )
                } else {
                    setConnected(true)
                }

                // Subscribe to the chat room if connected
                if (service.isConnected()) {
                    unsubscribeRef.current = service.subscribeToChatRoom(
                        chatRoomId,
                        (message) => {
                            console.log('Message received:', message)
                            onMessageReceived?.(message)
                        }
                    )
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error('WebSocket error')
                console.warn('WebSocket error:', error.message)
                setError(error)
                setConnected(false)
            }
        }

        connectAndSubscribe()

        // Cleanup
        return () => {
            if (retryTimeout) {
                clearTimeout(retryTimeout)
            }
            if (unsubscribeRef.current) {
                unsubscribeRef.current()
                unsubscribeRef.current = null
            }
        }
    }, [chatRoomId, onMessageReceived, retryCount])

    const sendMessage = useCallback((content: string) => {
        try {
            wsService.current.sendMessage(chatRoomId, content)
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to send message')
            setError(error)
            throw error
        }
    }, [chatRoomId])

    return {
        connected,
        error,
        sendMessage
    }
}
