import { useState } from 'react'
import { Button, View, SafeAreaView, Platform } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import Constants from 'expo-constants'

export default function TestScreen() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Get your computer's IP address and use it here
  // You can find it using `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  const LOCAL_IP = '192.168.1.191' // Replace with your computer's IP address

  const API_URL = Platform.select({
    ios: `http://${LOCAL_IP}:3000/api/roast`,
    android: `http://${LOCAL_IP}:3000/api/roast`,
    default: 'http://localhost:3000/api/roast',
  })

  const testRoast = async () => {
    try {
      setError(null)
      console.log('Sending request to:', API_URL)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          depositTransaction: {
            amount: 89.99,
            transactionType: 'PURCHASE',
            description: 'Premium Netflix Subscription',
            transactionTimestamp: '2024-03-14T15:30:00Z',
            debitCreditMemo: 'DEBIT',
            status: 'COMPLETED',
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        )
      }

      const data = await response.json()
      console.log('Response:', data)
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Button title='Test Roast' onPress={testRoast} />

        {error && (
          <ThemedText style={{ color: 'red', marginTop: 10 }}>
            Error: {error}
          </ThemedText>
        )}

        {result && (
          <View style={{ marginTop: 20 }}>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
              Useless Score: {result.useless_score}
            </ThemedText>
            <ThemedText style={{ marginTop: 10 }}>
              Roast: {result.roast}
            </ThemedText>
            <ThemedText style={{ marginTop: 10 }}>
              Explanation: {result.explanation}
            </ThemedText>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
