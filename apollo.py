import librosa
import numpy as np
from scipy.fft import fft
import math
from tqdm import tqdm

def get_chord_from_frequencies(frequencies, amplitudes, threshold=0.1):
    """
    Convert dominant frequencies to chord names using a simplified approach.
    This is a basic implementation - real chord detection would need more sophistication.
    """
    # Note frequencies (in Hz) for one octave
    notes = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    }
    
    # Find the dominant frequencies
    dominant_freqs = []
    for freq, amp in zip(frequencies, amplitudes):
        if amp > threshold * max(amplitudes):
            dominant_freqs.append(freq)
    
    # Match frequencies to notes
    detected_notes = []
    for freq in dominant_freqs:
        # Get the frequency in the base octave
        while freq > 493.88:  # Reduce until in base octave
            freq = freq / 2
        while freq < 261.63:  # Increase until in base octave
            freq = freq * 2
            
        # Find closest note
        closest_note = min(notes.items(), key=lambda x: abs(x[1] - freq))
        if closest_note[0] not in detected_notes:
            detected_notes.append(closest_note[0])
    
    # Simple chord determination (very basic)
    if len(detected_notes) >= 3:
        root = detected_notes[0]
        # This is a simplified approach - real chord detection would need more sophisticated analysis
        return f"{root} chord"
    elif len(detected_notes) == 2:
        return f"{detected_notes[0]}-{detected_notes[1]} dyad"
    elif len(detected_notes) == 1:
        return detected_notes[0]
    else:
        return "No chord detected"

def analyze_wav_file(file_path):
    """
    Analyze a WAV file and detect chords per measure.
    """
    print("Loading audio file...")
    y, sr = librosa.load(file_path)
    
    print("Detecting beats...")
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    
    # Estimate measures (assuming 4/4 time signature)
    beats_per_measure = 4
    measures = [beat_times[i:i+beats_per_measure] 
               for i in range(0, len(beat_times), beats_per_measure)]
    
    chords_per_measure = []
    
    print("Analyzing measures...")
    # Use tqdm to create a progress bar
    for i, measure in tqdm(enumerate(measures), total=len(measures), desc="Analyzing measures"):
        if len(measure) < beats_per_measure:  # Skip incomplete measures
            continue
            
        # Get the audio segment for this measure
        start_idx = int(measure[0] * sr)
        end_idx = int(measure[-1] * sr)
        measure_audio = y[start_idx:end_idx]
        
        # Apply FFT
        fft_result = fft(measure_audio)
        frequencies = np.fft.fftfreq(len(fft_result), 1/sr)
        amplitudes = np.abs(fft_result)
        
        # Only look at positive frequencies
        positive_frequencies_mask = frequencies > 0
        frequencies = frequencies[positive_frequencies_mask]
        amplitudes = amplitudes[positive_frequencies_mask]
        
        # Get chord for this measure
        chord = get_chord_from_frequencies(frequencies, amplitudes)
        chords_per_measure.append((i+1, chord))
    
    return chords_per_measure

def main():
    # Example usage
    file_path = "MozartSonataC.wav"  # Replace with your WAV file path
    try:
        print("\nStarting chord analysis...")
        results = analyze_wav_file(file_path)
        print("\nAnalysis complete! Results:")
        print("\nChords per measure:")
        for measure_num, chord in results:
            print(f"Measure {measure_num}: {chord}")
    except Exception as e:
        print(f"Error processing file: {e}")

if __name__ == "__main__":
    main()