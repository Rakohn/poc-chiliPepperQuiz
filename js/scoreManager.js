const scoreChannel = new BroadcastChannel('scoreChannel');
const teamContainer = document.getElementById('team-container');

scoreChannel.onmessage = (event) => {
    const { action, content } = event.data;

    if (action === 'loadTeam') {
        updateTeamCards(content);
    }

    document.dispatchEvent(new CustomEvent(event.data.action, {detail: event.data}))
};

document.addEventListener('loadTeam', event => {
    while (teamContainer.firstChild) {
        teamContainer.removeChild(teamContainer.firstChild);
    }

    // Générer les cartes dynamiquement
    Object.entries(event.detail.content).forEach(([buzzerId, team]) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const image = document.createElement('img');
        image.src = `images/${buzzerId}.png`;
        image.alt = `Logo de l'équipe ${team.name}`;

        const score = document.createElement('div');
        score.id = 'team-' + buzzerId;
        score.classList.add('score');
        score.textContent = team.score;

        card.appendChild(image);
        card.appendChild(score);

        teamContainer.appendChild(card);
    });
});
