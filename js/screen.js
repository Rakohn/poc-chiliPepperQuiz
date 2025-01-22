const jingleChannel = new BroadcastChannel('jingleChannel');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const containerTeam = document.getElementById('team-container');

// Gestion des jingles
jingleChannel.onmessage = (event) => {
    const { action, jingleId } = event.data;

    if (action === 'play') {
        // Masquer les cartes et afficher le lecteur vidéo
        containerTeam.classList.add('hidden');
        videoContainer.classList.remove('hidden');

        // Charger et lire la vidéo
        videoSource.src = `video/${jingleId}.mp4`;
        videoPlayer.load();
        videoPlayer.play();
    }
};

// Réafficher les cartes à la fin du jingle
videoPlayer.onended = () => {
    videoContainer.classList.add('hidden');
    containerTeam.classList.remove('hidden');
};
