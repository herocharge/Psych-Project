let isRecording = false;
let audioChunks = [];

document.getElementById('startTestButton').addEventListener('click', () => {
    // Show test section, hide start button
    document.getElementById('startTestSection').style.display = 'none';
    document.getElementById('testSection').style.display = 'block';

    // Start recording audio
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);

                reader.onloadend = () => {
                    const base64Audio = reader.result;
                    document.write(base64Audio);
                    // Send the base64Audio to your server for storage
                };
            };

            mediaRecorder.start();
            isRecording = true;

            setTimeout(() => {
                mediaRecorder.stop();
                isRecording = false;
                // Show the End Test button
                document.getElementById('endTestButton').style.display = 'block';
            }, 15000);
        })
        .catch((error) => {
            console.error('Error accessing microphone:', error);
            // Handle error as needed
        });
});

document.getElementById('endTestButton').addEventListener('click', () => {
    if (isRecording) {
        // Stop recording if it's still active
        mediaRecorder.stop();
        isRecording = false;
    }

    // Hide the test section and show the Start Test button
    document.getElementById('startTestSection').style.display = 'block';
    document.getElementById('testSection').style.display = 'none';

    // Hide the End Test button
    document.getElementById('endTestButton').style.display = 'none';
});
