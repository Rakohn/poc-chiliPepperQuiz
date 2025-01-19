/**
 * @deprecated this file is deprecated, kept as example
 */

const connection = new signalR.HubConnectionBuilder()
    .withUrl("ws://localhost:5000/buzzers-event", {
        transport: signalR.HttpTransportType.WebSockets, // Forcer WebSockets
        skipNegotiation: true, // Désactiver la négociation pour WebSockets purs
    }) // URL de connexion
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Événement déclenché lorsqu'un joueur a la main
connection.on("playerHasTheHand", (buzzerData) => {
    const buzzer = JSON.parse(buzzerData);
    console.log(`Buzzer ${buzzer.id} a pris la main !`);
    document.getElementById('buzzer-status').innerText =
        `Buzzer ${buzzer.id} a pris la main !`;
});

// Événement déclenché lorsqu'un joueur a buzzé
connection.on("playerPlayed", (buzzerData) => {
    const buzzer = JSON.parse(buzzerData);
    console.log(`Buzzer ${buzzer.id} a buzzé.`);
});

// Événement pour lister les buzzers connectés
connection.on("playerListing", (buzzerList) => {
    const buzzers = JSON.parse(buzzerList);
    console.log("Buzzers connectés :", buzzers);
});

// Gestion des erreurs
connection.onclose(err => {
    console.error("Connexion fermée :", err);
    document.getElementById('buzzer-status').innerText =
        "Erreur de connexion au WebSocket.";
});

connection.serverTimeoutInMilliseconds = 1000 * 60 * 10; // 10 minutes
connection.keepAliveIntervalInMilliseconds = 1000 * 60 * 5; // 5 minutes

// Démarrer la connexion
connection.start()
    .then(() => {
        console.log("Connecté au WebSocket via SignalR");

        // Accéder au transport sous-jacent
        const transport = connection.connection.transport;

        // Intercepter les données brutes reçues par SignalR
        transport.onreceive = (data) => {
            // Séparer les messages groupés par le délimiteur \u001E
            const messages = data.split("\u001E");
            console.log(messages);

            messages.forEach(message => {
                if (message.trim()) {
                    try {
                        console.log(message);
                        // Passer chaque message séparé au gestionnaire SignalR natif
                        transport.onreceive.call(transport, message.trim() + "\u001E");
                    } catch (error) {
                        console.error("Erreur lors du traitement d'un message groupé :", error, message);
                    }
                }
            });
        };
    })
    // .then(() => console.log("Connecté au WebSocket via SignalR"))
    .catch(err => console.error("Erreur lors de la connexion :", err));

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
