import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import FFT from 'fft.js'; // Install using `npm install fft.js`

export default function ListenScreen() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [chords, setChords] = useState<string[] | null>(null);

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/vnd.wave',
      });
      
      if (result.assets) {
        setFileName(result.assets[0].name);
        processAudio(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select the file.');
    }
  };

  const processAudio = async (uri: string) => {
    try {
        const { sound } = await Audio.Sound.createAsync({ uri });
        const { durationMillis } = await sound.getStatusAsync();

        const audioBuffer = await fetchAudioBuffer(uri);
        const chunks = splitAudioBuffer(audioBuffer, durationMillis);

        const chordsDetected = chunks.map(analyzeChunk);
        setChords(chordsDetected);
        Alert.alert('Chords Detected', chordsDetected.join(', '));
    } catch (error) {
        console.log(`Error from processAudio:\n${error}`);
        Alert.alert('Error', 'Failed to process the audio.');
    }
  };

  const fetchAudioBuffer = async (uri: string) => {
    try {
        const { sound } = await Audio.Sound.createAsync({ uri });
        const status = await sound.getStatusAsync();

        if (!status.isLoaded) {
            throw new Error('Audio failed to load.');
        }

        // Retrieve the raw PCM data from the audio (simulated here, actual implementation depends on your FFT library)
        const audioData = await fetch(uri);
        const arrayBuffer = await audioData.arrayBuffer();

        console.log('Audio array buffer fetched successfully.');
        return arrayBuffer;
    } catch (error) {
        console.log(`Error from fetchAudioBuffer:\n${error}`);
        Alert.alert('Error', 'Failed to fetch audio buffer.')
    }
  };

  const splitAudioBuffer = async (uri: string, measureDuration = 2) => {
        try {
            // Fetch the raw audio data
            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();

            // Decode the audio data using expo-av or a similar library
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            if (!audioBuffer) {
                throw new Error('Failed to decode audio buffer.');
            }

            const sampleRate = audioBuffer.sampleRate;
            const chunkSize = Math.floor(measureDuration * sampleRate); // Measure duration in seconds
            const numChunks = Math.floor(audioBuffer.duration / measureDuration);
            const chunks = [];

            for (let i = 0; i < numChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, audioBuffer.length); // Prevent out-of-bounds access
                const chunk = audioBuffer.getChannelData(0).slice(start, end); // Extract channel data
                chunks.push(chunk);
            }

            console.log('Audio chunks:', chunks);
            return chunks;
        } catch (error) {
            console.error('Error from splitAudioBuffer:', error);
            Alert.alert('Error', 'Failed to process the audio buffer.');
            return [];
        }
    };

  const analyzeChunk = (chunk: Float32Array) => {
    const fft = new FFT(chunk.length);
    const out = fft.createComplexArray();
    fft.realTransform(out, chunk);

    const frequencies = mapFFTtoFrequencies(out);
    return mapFrequenciesToChords(frequencies);
  };

  const mapFFTtoFrequencies = (fftOutput: Float32Array) => {
    // Example: Map FFT output to corresponding frequencies
    return fftOutput.map((value, index) => index * 44100 / fftOutput.length);
  };

  const mapFrequenciesToChords = (frequencies: number[]) => {
    // Example: Match frequencies to chords
    // This would require a more advanced algorithm to map dominant frequencies to chord names.
    return 'C Major'; // Placeholder
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select a WAV file to analyze</Text>
      <TouchableOpacity style={styles.button} onPress={selectFile}>
        <Text style={styles.buttonText}>Select File</Text>
      </TouchableOpacity>
      {fileName && <Text style={styles.fileName}>Selected File: {fileName}</Text>}
      {chords && (
        <View style={styles.chordsContainer}>
          <Text style={styles.chordsTitle}>Chords Detected:</Text>
          {chords.map((chord, index) => (
            <Text key={index} style={styles.chordText}>{chord}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ffd33d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#25292e',
    fontWeight: 'bold',
  },
  fileName: {
    marginTop: 10,
    fontSize: 16,
    color: '#25292e',
  },
  chordsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chordText: {
    fontSize: 16,
    color: '#25292e',
  },
});
