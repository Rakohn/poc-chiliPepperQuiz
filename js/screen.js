const channel = new BroadcastChannel('jingleChannel');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const scoreTable = document.getElementById('scoreTable');

channel.onmessage = (event) => {
    const { action, jingleId } = event.data;

    if (action === 'play') {
        // Masquer le tableau des scores avec animation
        scoreTable.classList.add('hidden');

        // Attendre la fin de l'animation avant d'afficher la vidéo
        setTimeout(() => {
            videoContainer.style.display = 'block';
            videoSource.src = `video/${jingleId}.mp4`;
            videoPlayer.load();
            videoPlayer.play();

            // Passer en plein écran
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        }, 800); // Correspond au temps de l'animation CSS
    }
};

// Réaffiche le tableau après la fin de la vidéo
videoPlayer.onended = () => {
    videoContainer.style.display = 'none';
    scoreTable.classList.remove('hidden');
};
