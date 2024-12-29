import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
const App = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any>([]);
  const socketRef = useRef<any>(null);
  useEffect(() => {
    const socket = io('http://192.168.1.129:3000');
    socketRef.current = socket;
    socket.on('message', (msg) => {
      if (msg.sender !== socket.id) { 
        setChatMessages((prevMessages: any) => [msg, ...prevMessages]);
      }
    });
    return () => {
      socket.disconnect();
    };
  },[])

  const sendMessage = () => {
    const socket = socketRef.current;
    console.log('socket.idfront', socket.id)
    if (message.trim() !== '') {
      socket.emit('message', message);
       setChatMessages((prevMessages:any) => [{  text: message,sender:socket.id  },...prevMessages]);
      setMessage('');
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
         data={chatMessages}
        keyExtractor={(item, index) => index.toString()}
        inverted
        contentContainerStyle={{top:'10%'}}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer,{
            alignSelf: item.sender === socketRef.current.id ? 'flex-end' : 'flex-start',
          backgroundColor: item.sender === socketRef.current.id ? '#DCF8C6' : '#FFFFFF',
            }]}>
            <Text style={styles.username}>{item.sender.substring(0,3)}:</Text>
            <Text style={styles.message}>{item.text}</Text>
          </View>
        )}
        style={styles.chatArea}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal:20,
  },
  chatArea: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    width: '50%',
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  message: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    bottom:40
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})