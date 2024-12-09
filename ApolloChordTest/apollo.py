import tkinter as tk
from tkinter import ttk, filedialog, scrolledtext
import librosa
import numpy as np
from scipy.fft import fft
import threading
from pathlib import Path
import queue

class ChordAnalyzerGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Chord Analyzer")
        self.root.geometry("600x500")
        
        # Create a queue for thread communication
        self.queue = queue.Queue()
        
        # Define common time signatures
        self.time_signatures = {
            "4/4": 4,
            "3/4": 3,
            "6/8": 6,
            "12/8": 12,
            "2/4": 2,
            "2/2": 2,
            "9/8": 9,
        }
        
        self.setup_ui()
        
    def setup_ui(self):
        # Main container with padding
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        
        # File selection frame
        file_frame = ttk.Frame(main_frame)
        file_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        file_frame.columnconfigure(1, weight=1)
        
        # File path entry and browse button
        self.file_path = tk.StringVar()
        ttk.Label(file_frame, text="WAV File:").grid(row=0, column=0, padx=(0, 5))
        self.file_entry = ttk.Entry(file_frame, textvariable=self.file_path)
        self.file_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 5))
        ttk.Button(file_frame, text="Browse", command=self.browse_file).grid(row=0, column=2)
        
        # Time signature selection
        time_frame = ttk.Frame(main_frame)
        time_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        ttk.Label(time_frame, text="Time Signature:").grid(row=0, column=0, padx=(0, 5))
        self.time_sig_var = tk.StringVar(value="4/4")  # Default to 4/4 
        time_sig_combo = ttk.Combobox(time_frame, textvariable=self.time_sig_var, 
                                    values=list(self.time_signatures.keys()),
                                    state="readonly", width=10)
        time_sig_combo.grid(row=0, column=1, sticky=tk.W)
        
        # Analyze button
        self.analyze_button = ttk.Button(main_frame, text="Analyze", command=self.start_analysis)
        self.analyze_button.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Progress frame
        progress_frame = ttk.Frame(main_frame)
        progress_frame.grid(row=3, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Progress bar and label
        self.progress_var = tk.DoubleVar()
        self.progress_label = ttk.Label(progress_frame, text="Ready")
        self.progress_label.grid(row=0, column=0, sticky=(tk.W), pady=(0, 5))
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_var, maximum=100)
        self.progress_bar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        # Results text area
        self.results_text = scrolledtext.ScrolledText(main_frame, height=15, wrap=tk.WORD)
        self.results_text.grid(row=4, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        main_frame.rowconfigure(4, weight=1)
        
    def browse_file(self):
        filename = filedialog.askopenfilename(
            filetypes=[("WAV files", "*.wav"), ("All files", "*.*")]
        )
        if filename:
            self.file_path.set(filename)
            
    def update_progress(self, value, message):
        self.progress_var.set(value)
        self.progress_label.config(text=message)
        
    def update_results(self, message):
        self.results_text.insert(tk.END, message + "\n")
        self.results_text.see(tk.END)
        
    def start_analysis(self):
        if not self.file_path.get():
            self.update_results("Please select a WAV file first!")
            return
            
        # Clear previous results
        self.results_text.delete(1.0, tk.END)
        self.analyze_button.state(['disabled'])
        
        # Start analysis in a separate thread
        thread = threading.Thread(target=self.analyze_file)
        thread.daemon = True
        thread.start()
        
        # Start checking the queue for updates
        self.root.after(100, self.check_queue)
        
    def check_queue(self):
        try:
            while True:
                msg_type, msg_content = self.queue.get_nowait()
                if msg_type == "progress":
                    value, message = msg_content
                    self.update_progress(value, message)
                elif msg_type == "result":
                    self.update_results(msg_content)
                elif msg_type == "complete":
                    self.analyze_button.state(['!disabled'])
                    return
                self.queue.task_done()
        except queue.Empty:
            self.root.after(100, self.check_queue)
            
    def analyze_file(self):
        try:
            # Get selected time signature
            time_sig = self.time_sig_var.get()
            beats_per_measure = self.time_signatures[time_sig]
            
            # Load audio file
            self.queue.put(("progress", (0, "Loading audio file...")))
            y, sr = librosa.load(self.file_path.get())
            
            # Detect beats
            self.queue.put(("progress", (20, "Detecting beats...")))
            tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
            
            # For compound meters (6/8, 9/8, 12/8), we need to adjust beat detection
            if time_sig in ['6/8', '9/8', '12/8']:
                # For compound meters, we need to group beats in sets of 3
                beat_times = librosa.frames_to_time(beat_frames, sr=sr)
                grouped_beats = []
                for i in range(0, len(beat_times), 3):
                    if i + 2 < len(beat_times):
                        # Use the first beat of each group
                        grouped_beats.append(beat_times[i])
                beat_times = np.array(grouped_beats)
            else:
                beat_times = librosa.frames_to_time(beat_frames, sr=sr)
            
            # Process measures based on time signature
            measures = [beat_times[i:i+beats_per_measure] 
                       for i in range(0, len(beat_times), beats_per_measure)]
            
            self.queue.put(("progress", (30, "Analyzing measures...")))
            self.queue.put(("result", f"Analyzing with time signature: {time_sig}"))
            total_measures = len(measures)
            
            for i, measure in enumerate(measures):
                if len(measure) < beats_per_measure:
                    continue
                    
                # Update progress
                progress = 30 + (i / total_measures * 70)
                self.queue.put(("progress", (progress, f"Analyzing measure {i+1} of {total_measures}")))
                
                # Analyze measure
                start_idx = int(measure[0] * sr)
                end_idx = int(measure[-1] * sr)
                measure_audio = y[start_idx:end_idx]
                
                fft_result = fft(measure_audio)
                frequencies = np.fft.fftfreq(len(fft_result), 1/sr)
                amplitudes = np.abs(fft_result)
                
                positive_frequencies_mask = frequencies > 0
                frequencies = frequencies[positive_frequencies_mask]
                amplitudes = amplitudes[positive_frequencies_mask]
                
                chord = self.get_chord_from_frequencies(frequencies, amplitudes)
                self.queue.put(("result", f"Measure {i+1}: {chord}"))
            
            self.queue.put(("progress", (100, "Analysis complete!")))
            self.queue.put(("complete", None))
            
        except Exception as e:
            self.queue.put(("result", f"Error: {str(e)}"))
            self.queue.put(("progress", (0, "Error occurred")))
            self.queue.put(("complete", None))
            
    def get_chord_from_frequencies(self, frequencies, amplitudes, threshold=0.1):
        notes = {
            'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
            'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
            'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
        }
        
        dominant_freqs = []
        for freq, amp in zip(frequencies, amplitudes):
            if amp > threshold * max(amplitudes):
                dominant_freqs.append(freq)
        
        detected_notes = []
        for freq in dominant_freqs:
            while freq > 493.88:
                freq = freq / 2
            while freq < 261.63:
                freq = freq * 2
                
            closest_note = min(notes.items(), key=lambda x: abs(x[1] - freq))
            if closest_note[0] not in detected_notes:
                detected_notes.append(closest_note[0])
        
        if len(detected_notes) >= 3:
            root = detected_notes[0]
            return f"{root} chord"
        elif len(detected_notes) == 2:
            return f"{detected_notes[0]}-{detected_notes[1]} dyad"
        elif len(detected_notes) == 1:
            return detected_notes[0]
        else:
            return "No chord detected"

def main():
    root = tk.Tk()
    app = ChordAnalyzerGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()