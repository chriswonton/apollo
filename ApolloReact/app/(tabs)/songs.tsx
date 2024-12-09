import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

// Define the type for a song object
interface Song {
  id: string;
  title: string;
  chords: string[];
}

// Sample songs data
const songs: Song[] = [
  { id: '1', title: 'Bohemian Rhapsody', chords: ['Bb', 'F', 'C', 'G'] },
  { id: '2', title: 'Imagine', chords: ['C', 'F', 'G', 'Am'] },
  { id: '3', title: 'Stairway to Heaven', chords: ['Am', 'C', 'D', 'F'] },
  { id: '4', title: 'Hey Jude', chords: ['F', 'C', 'G', 'Bb'] },
  { id: '5', title: 'Let It Be', chords: ['C', 'G', 'Am', 'F'] },
];

export default function SongsScreen() {
  const handleViewChords = (songTitle: string, chords: string[]) => {
    Alert.alert(
      `Chords for ${songTitle}`,
      chords.join(', '),
      [{ text: 'OK' }]
    );
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <View style={styles.songItem}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <TouchableOpacity
        style={styles.viewChordsButton}
        onPress={() => handleViewChords(item.title, item.chords)}
      >
        <Text style={styles.buttonText}>View Chords</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Most Popular Songs</Text>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        style={styles.songList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 20,
  },
  songList: {
    width: '100%',
  },
  songItem: {
    backgroundColor: '#485779',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  viewChordsButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#25292e',
    fontWeight: '600',
  },
});
