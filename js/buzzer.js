// Connexion WebSocket
const socket = new WebSocket('ws://localhost:5000/buzzers-event');

socket.onopen = () => {
    console.log('Connecté au WebSocket');
    socket.send(JSON.stringify({ protocol: 'json', version: 1 }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Événement reçu:', data);
    document.getElementById('buzzer-status').innerText = JSON.stringify(data.arguments[0]);
};

// Fonction pour verrouiller tous les buzzers
function lockAll() {
    fetch('http://localhost:5000/game/lock', {
        method: 'POST'
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
        method: 'POST'
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
        method: 'POST'
    }).then(response => {
        if (response.ok) {
            alert('La partie est réinitialisée.');
        }
    }).catch(err => {
        console.error('Erreur:', err);
    });
}
