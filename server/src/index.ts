import ws, { WebSocketServer } from 'ws';
import { PlanetManager, ClientServerMessage, NewPlanetData } from '../lib/planet';

let planets = new PlanetManager();
planets.addPlanet({ pos: { x: 400, y: 400 }, vel: { x: 0, y: 0 }, mass: 700 });

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