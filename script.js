document.addEventListener('DOMContentLoaded', function () {
    const paragraphInput = document.getElementById('paragraphInput');
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const recordingContainer = document.getElementById('recordingContainer');
    const recordedVideo = document.getElementById('recordedVideo');
    const highlightedText = document.getElementById('highlightedText');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentWordIndex = 0;
    let words;

    startRecordingBtn.addEventListener('click', startRecording);
    downloadBtn.addEventListener('click', downloadVideo);

    function startRecording() {
        words = paragraphInput.value.split(' ');
        currentWordIndex = 0;

        recordingContainer.style.display = 'block';

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                recordedVideo.srcObject = stream;
                highlightNextWord();
            })
            .catch(error => {
                console.error('Error accessing media devices:', error);
            });
    }

    function highlightNextWord() {
        if (currentWordIndex < words.length) {
            highlightedText.textContent = words[currentWordIndex];
            currentWordIndex++;

            // Call the function recursively with a delay
            setTimeout(highlightNextWord, 1000);
        } else {
            // Recording completed
            stopRecording();
        }
    }

    function stopRecording() {
        const stream = recordedVideo.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop());

        recordedVideo.srcObject = null;
        recordingContainer.style.display = 'none';
        downloadBtn.style.display = 'block';
    }

    function downloadVideo() {
        const blob = new Blob([], { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recorded_video.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
