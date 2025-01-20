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
                document.dispatchEvent(new CustomEvent(message.target, {detail: message.arguments}));
            } else {
                console.log(message);
            }
        }
    });
};

document.addEventListener('playerHasTheHand', event => {
    console.log(event);
});

document.addEventListener('playerIsLocked', event => {
    console.log(event);
});

document.addEventListener('playerPlayed', event => {
    console.log(event);
});

document.addEventListener('playerHasReleasedTheHand', event => {
    console.log(event);
});

document.addEventListener('playerIsReseted', event => {
    console.log(event);
});

document.addEventListener('playerIsEnrolled', event => {
    console.log(event);
});

document.addEventListener('playerListing', event => {
    console.log(event);
});

document.addEventListener('playerIsUnlocked', event => {
    console.log(event);
});

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

function getBuzzersList() {
    fetch('http://localhost:5000/buzzers')
    .then(response => {
        if (response.ok) {
            return response.json;
        }
    })
    .then(data => {
        console.log(data);
    })
}