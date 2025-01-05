const channel = new BroadcastChannel('jingleChannel');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const scoreTable = document.getElementById('scoreTable');

channel.onmessage = (event) => {
    const { action, jingleId } = event.data;

    if (action === 'play') {
        // Masquer le tableau des scores
        scoreTable.style.display = 'none';

        // Afficher le lecteur vidéo
        videoContainer.style.display = 'block';

        // Charger et lire la vidéo
        videoSource.src = `video/${jingleId}.mp4`;
        videoPlayer.load();
        videoPlayer.play();

        // Passer en plein écran
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) { // Firefox
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) { // Chrome, Safari et Opera
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) { // IE/Edge
            videoContainer.msRequestFullscreen();
        }
    }
};

// Réafficher le tableau des scores après la vidéo
videoPlayer.onended = () => {
    videoContainer.style.display = 'none';
    scoreTable.style.display = 'block';
};
