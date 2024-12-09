import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Ionicons name="musical-notes" size={80} color="#fa8667" />
      <Text style={styles.title}>Apollo</Text>
      <Text style={styles.subtitle}>Discover the chords behind the music.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/listen')}>
        <Text style={styles.buttonText}>Start Listening</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Link href="/songs" style={styles.link}>
          Popular Songs
        </Link>
      </View>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fa8667',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#485779',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  link: {
    fontSize: 16,
    color: '#fa8667',
    textDecorationLine: 'underline',
    marginHorizontal: 10,
  },
});
