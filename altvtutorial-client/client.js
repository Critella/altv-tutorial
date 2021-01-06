/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client';
import * as native from 'natives';

const player = alt.Player.local;
let loginView;

alt.on('connectionComplete', () => {
    loginView = new alt.WebView("http://resource/login/index.html");
    loginView.focus();

    alt.showCursor(true);
    alt.toggleGameControls(false);
    native.doScreenFadeOut(0);

    loginView.on('alttutorial:login', (name, password) => {
        alt.emitServer('alttutorial:loginAttempt', name, password);
    });

    loginView.on('alttutorial:register', (name, password) => {
        alt.emitServer('alttutorial:registerAttempt', name, password);
    });
})

alt.onServer('alttutorial:loginSuccess', () => {
    alt.showCursor(false);
    alt.toggleGameControls(true);
    native.doScreenFadeIn(1000);
    if(loginView) loginView.destroy();
})

alt.onServer('alttutorial:loginError', (type, msg) => {
    if(loginView) loginView.emit('showError', type, msg);
})

alt.onServer('alttutorial:notify', (msg) => {
    const textEntry = `TEXT_ENTRY_${(Math.random() * 1000).toFixed(0)}`;
    alt.addGxtText(textEntry, msg);
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringTextLabel(textEntry);
    native.endTextCommandThefeedPostTicker(false, false);

    //alt.emitServer('eventname', params);
});

alt.onServer('alttutorial:fixveh', () => {
    if(player.vehicle) {
        native.setVehicleFixed(player.vehicle.scriptID);
    }
})