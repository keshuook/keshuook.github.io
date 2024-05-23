const Player = new MidiPlayer.Player();
const ctx = new AudioContext();
var piano = 0;

Soundfont.instrument(ctx, 'acoustic_grand_piano').then(async instrument => {
    piano = instrument;
    await Player.loadDataUri(songDataURI);
    document.querySelector("#loader").remove();
});

Player.on('midiEvent', (ev) => {
    if(ev.name == "Note on") {
        piano.play(ev.noteName, ctx.currentTime, {
            gain: (ev.velocity + 1)/50
        });
        try {
            document.getElementById(ev.noteNumber).classList.add("pressed");
        }catch(err){}
    }
    if (ev.name === 'Note off' || ev.velocity === 0) {
        try {
            document.getElementById(ev.noteNumber).classList.remove("pressed");
        }catch(err){}
    }
});

function beginMusic() {
    document.getElementById("card").remove();
    Player.play();
}