// On masque les bouton de contrôle de validation de réponse
document.getElementById('controlButtonsContainer').hidden = true;

//variable global pour enregistrer le buzzer qui a la main
var hasHandBuzzerId = null;

const scorePageChannel = new BroadcastChannel('scoreChannel');
const socket = new WebSocket('ws://localhost:5000/buzzers-event');

socket.onopen = () => {
    console.log('Connecté au WebSocket');
    socket.send(JSON.stringify({ protocol: 'json', version: 1 }) + "\u001E");
};

socket.onmessage = (event) => {
    const messages = event.data.split("\u001E");

    messages.forEach(rawMessage => {
        if (rawMessage.trim()) {
            const message = JSON.parse(rawMessage);

            if (message.type == 1) {
                document.dispatchEvent(new CustomEvent(message.target, {detail: JSON.parse(message.arguments)}));
            } else {
                console.log(message);
            }
        }
    });
};

document.addEventListener('playerHasTheHand', event => {
    hasHandBuzzerId = event.detail.id;
    document.getElementById('controlButtonsContainer').hidden = false;

    scorePageChannel.postMessage({
        action: 'teamHasTheHand',
        buzzerId: hasHandBuzzerId
    });

    const teams = JSON.parse(localStorage.getItem('teams'));
    document.getElementById('buzzer-status').textContent = teams[hasHandBuzzerId].name;
});

// Bonne réponse ! Reset de l'état des buzzers et on envoi le nombre de point à ajouter au tableau des scores
document.getElementById('validateButton').addEventListener("click", event => {
    document.getElementById('controlButtonsContainer').hidden = true;
    const teams = JSON.parse(localStorage.getItem('teams'));
    teams[hasHandBuzzerId].score += parseInt(document.getElementById('earnable').value);

    resetBuzzer();

    scorePageChannel.postMessage({
        action: 'answered',
        buzzerId: hasHandBuzzerId,
        points: teams[hasHandBuzzerId].score
    });

    localStorage.setItem('teams', JSON.stringify(teams));
});

// Mauvaise réponse ! On rend la main
document.getElementById('invalidateButton').addEventListener("click", event => {
    document.getElementById('controlButtonsContainer').hidden = true;
    const teams = JSON.parse(localStorage.getItem('teams'));

    resetBuzzer();

    scorePageChannel.postMessage({
        action: 'answered',
        buzzerId: hasHandBuzzerId,
        points: teams[hasHandBuzzerId].score
    });
});

// Mauvaise réponse ! On rend la main et en plus l'équipe perd des points
document.getElementById('loseButton').addEventListener("click", event => {
    document.getElementById('controlButtonsContainer').hidden = true;
    const teams = JSON.parse(localStorage.getItem('teams'));
    teams[hasHandBuzzerId].score += -parseInt(document.getElementById('earnable').value);

    resetBuzzer();

    scorePageChannel.postMessage({
        action: 'answered',
        buzzerId: hasHandBuzzerId,
        points: teams[hasHandBuzzerId].score
    });

    localStorage.setItem('teams', JSON.stringify(teams));
});

// Listing des équipes
document.addEventListener('playerListing', event => {
    const buzzers = event.detail; // Liste des buzzers envoyés par le serveur
    const availableTeams = getTeamsReference();
    const teams = JSON.parse(localStorage.getItem('teams') ?? '{}');

    buzzers.forEach(buzzer => {
        if (!teams[buzzer.id]) {
            teams[buzzer.id] = {
                name: availableTeams[buzzer.id],
                score: 0
            };
        }
    });

    scorePageChannel.postMessage({
        action: "loadTeam",
        content: teams
    });

    // Sauvegarde dans le localStorage
    localStorage.setItem('teams', JSON.stringify(teams));
    console.log('Équipes initialisées :', teams);
});

function lockAll() {
    fetch('http://localhost:5000/game/lock', {
        method: 'POST',
        mode: 'no-cors'
    }).then(response => {
        if (response.ok) {
            alert('Tous les buzzers sont verrouillés.');
        }
    }).catch(err => {
        console.error('Erreur:', err);
    });
}

// Fonction pour déverrouiller tous les buzzers
function unlockAll() {
    fetch('http://localhost:5000/game/unlock', {
        method: 'POST',
        mode: 'no-cors'
    }).catch(err => {
        console.error('Erreur:', err);
    });
}

// Fonction pour reset la partie
function resetBuzzer() {
    fetch('http://localhost:5000/game/reset', {
        method: 'POST',
        mode: 'no-cors'
    }).catch(err => {
        console.error('Erreur:', err);
    });
    
    document.getElementById('buzzer-status').textContent = "Aucune équipe n'a la main";
}

// "Charger les Buzzers Connectés" button event
document.getElementById('loadBuzzers').addEventListener('click', event => {
    fetch('http://localhost:5000/buzzers', {mode: 'no-cors'});
});

document.getElementById('newGame').addEventListener("click", event => {
    resetBuzzer();
    localStorage.removeItem('teams');
    document.getElementById('loadBuzzers').click();

    fetch('http://localhost:5000/game', {
        method: 'POST',
        mode: 'no-cors',
        body: {
            giveHandDuration: 3600000,
        }
    }).catch(error => console.log(error));
});
