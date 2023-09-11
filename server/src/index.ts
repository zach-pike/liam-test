import ws, { WebSocketServer } from 'ws';
import { PlanetManager, ClientServerMessage, NewPlanetData } from '../lib/planet';

let planets = new PlanetManager();

const wss = new WebSocketServer({
    port: 8081
})

wss.on('connection', (socket) => {
    socket.on('message', (m) => {
        let obj: ClientServerMessage<NewPlanetData> = JSON.parse(m.toString());
        
        switch(obj.intent) {
            case "addPlanet": {
                planets.addPlanet({ pos: obj.data.pos, vel: obj.data.vel, mass: obj.data.mass });
            } break;
        }
    })
})

setInterval(() => {
    planets.planetUpdate();
}, (1/60)*1000);

setInterval(() => {
    wss.clients.forEach((socket) => {
        socket.send(JSON.stringify(planets.getPlanets()));
    });
}, 500);