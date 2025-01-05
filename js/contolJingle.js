const channel = new BroadcastChannel('jingleChannel');

function playJingle(id) {
    console.log('Lancement du Jingle ' + id);
    channel.postMessage({ action: 'play', jingleId: id });
}
