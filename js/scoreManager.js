const scoreChannel = new BroadcastChannel('scoreChannel');
const scoreBody = document.getElementById('scoreBody');

// Initialisation des équipes et scores
let teams = [
    { id: 1, team: 'Équipe Jalapeño', score: 0 },
    { id: 2, team: 'Équipe Habanero', score: 0 },
    { id: 3, team: 'Équipe Carolina Reaper', score: 0 },
    { id: 4, team: 'Équipe Piment d\'Espelette', score: 0 }
];

// Mise à jour initiale
updateScoreTable(teams);

// Écoute des mises à jour des scores
scoreChannel.onmessage = (event) => {
    const { action, scores } = event.data;

    if (action === 'scoreUpdate' && scores) {
        teams = scores;
        updateScoreTable(teams);
    }
};

// Met à jour le tableau des scores
function updateScoreTable(scores) {
    scoreBody.innerHTML = '';  // Efface l'ancien contenu

    scores.forEach(buzzer => {
        scoreBody.innerHTML += `
            <tr>
                <td>${buzzer.team}</td>
                <td>${buzzer.score}</td>
            </tr>
        `;
    });
}
