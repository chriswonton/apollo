import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// import { Audio } from 'expo-av';
// import FFT from 'fft.js';

export default function ListenScreen() {

  const handleFileInput = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/vnd.wave',
      });
      
      if (result.assets) {
        console.log('Selected file:', result.assets[0].name);
        Alert.alert('File Selected', `You selected: ${result.assets[0].name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select the file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listening Prototype</Text>
      <TouchableOpacity style={styles.button} onPress={handleFileInput}>
        <Text style={styles.buttonText}>Select .wav File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fa8667',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#485779',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});