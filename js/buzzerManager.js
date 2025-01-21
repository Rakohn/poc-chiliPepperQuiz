document.getElementById('saveTeams').hidden = true;

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
    console.log(event);
});

document.addEventListener('playerListing', event => {
    const buzzers = event.detail; // Liste des buzzers envoyés par le serveur
    const buzzerListContainer = document.getElementById('buzzerListContainer');
    const savedTeams = JSON.parse(localStorage.getItem('teams') ?? '{}');

    // Réinitialise le conteneur pour éviter les doublons
    while (buzzerListContainer.firstChild) {
        buzzerListContainer.removeChild(buzzerListContainer.firstChild);
    }

    buzzers.forEach(buzzer => {
        const buzzerElement = document.createElement('div');
        buzzerElement.className = 'buzzer-entry';

        const strongElement = document.createElement('strong');
        strongElement.textContent = `Buzzer ID : ${buzzer.id}`;

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', `teamName-${buzzer.id}`);
        labelElement.textContent = "Nom de l'équipe :";

        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('id', `teamName-${buzzer.id}`);
        inputElement.setAttribute('placeholder', "Entrez un nom d'équipe");
        inputElement.style.marginLeft = '10px';

        if (savedTeams[buzzer.id]) {
            inputElement.value = savedTeams[buzzer.id].name;
        }

        buzzerElement.appendChild(strongElement);
        buzzerElement.appendChild(document.createElement('br'));
        buzzerElement.appendChild(labelElement);
        buzzerElement.appendChild(inputElement);

        buzzerListContainer.appendChild(buzzerElement);
    });

    document.getElementById('saveTeams').hidden = false;
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
    }).then(response => {
        if (response.ok) {
            alert('Tous les buzzers sont déverrouillés.');
        }
    }).catch(err => {
        console.error('Erreur:', err);
    });
}

// Fonction pour reset la partie
function resetGame() {
    fetch('http://localhost:5000/game/reset', {
        method: 'POST',
        mode: 'no-cors'
    }).then(response => {
        if (response.ok) {
            alert('La partie est réinitialisée.');
        }
    }).catch(err => {
        console.error('Erreur:', err);
    });
}

// "Charger les Buzzers Connectés" button event
document.getElementById('loadBuzzers').addEventListener('click', event => {
    fetch('http://localhost:5000/buzzers', {mode: 'no-cors'});
});

// "Enregistrer" team management section button
document.getElementById('saveTeams').addEventListener('click', event => {
    const buzzerListContainer = document.getElementById('buzzerListContainer');
    const teams = {};

    // Parcourt les champs texte pour récupérer les noms d'équipe
    const inputs = buzzerListContainer.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        const buzzerId = input.id.split('-')[1]; // Extraire l'ID du buzzer à partir de l'ID du champ
        const teamName = input.value.trim(); // Récupérer le nom de l'équipe

        if (teamName) {
            if (teams[buzzerId]) {
                teams[buzzerId].name = teamName;
            } else {
                teams[buzzerId] = {
                    name: teamName,
                    score: 0
                };
            }
        }
    });

    // Sauvegarde dans le localStorage
    localStorage.setItem('teams', JSON.stringify(teams));
    document.getElementById('saveTeams').hidden = true;
    console.log('Équipes enregistrées :', teams);
});
