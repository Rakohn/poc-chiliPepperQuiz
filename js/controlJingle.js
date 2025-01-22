const jingleChannel = new BroadcastChannel('jingleChannel');

function playJingle(id) {
    console.log('Lancement du Jingle ' + id);
    jingleChannel.postMessage({ action: 'play', jingleId: id });
}
