const channel = new BroadcastChannel('scoreChannel');
let activeBuzzer = null;

// Gestion des clics sur les buzzers simulés
document.querySelectorAll('.buzzer').forEach(button => {
    button.addEventListener('click', () => {
        const buzzerId = button.dataset.id;
        pressBuzzer(buzzerId);
    });
});

// Fonction de simulation d'un buzzer pressé
function pressBuzzer(buzzerId) {
    if (activeBuzzer) return;  // Si un buzzer a déjà la main, ignorer
    activeBuzzer = buzzerId;

    console.log(`Buzzer ${buzzerId} a été pressé.`);

    // Envoyer un message à la page de contrôle
    channel.postMessage({
        action: 'update',
        team: `Buzzer ${buzzerId}`
    });

    // Verrouiller les autres buzzers
    lockAllBuzzers();
}

// Simule le verrouillage de tous les buzzers
function lockAllBuzzers() {
    document.querySelectorAll('.buzzer').forEach(button => {
        button.disabled = true;
    });
    console.log('Tous les buzzers sont verrouillés.');
}

// Déverrouille tous les buzzers
function unlockAllBuzzers() {
    document.querySelectorAll('.buzzer').forEach(button => {
        button.disabled = false;
    });
    console.log('Tous les buzzers sont déverrouillés.');
    activeBuzzer = null;
}

// Écoute les messages de la page de contrôle pour valider/invalider
channel.onmessage = (event) => {
    const { action } = event.data;

    if (action === 'unlock') {
        unlockAllBuzzers();
    }
};
