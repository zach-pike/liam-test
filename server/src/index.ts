import ws, { WebSocketServer } from 'ws';
import { PlanetManager, Planet, Vec2, ClientServerMessage, NewPlanetData } from './lib/planet';

let planets = new PlanetManager();

const wss = new WebSocketServer({
    port: 8081
})

wss.on('connection', (socket) => {
    socket.on('message', (m) => {
        let obj: ClientServerMessage<NewPlanetData> = JSON.parse(m.toString());
        
        switch(obj.intent) {
            case "addPlanet": {
                //@ts-ignore
                let pos = new Vec2(obj.data.pos.x, obj.data.pos.y);
                // @ts-ignore
                let vel = new Vec2(obj.data.vel.x, obj.data.vel.y);


                planets.addPlanet(new Planet(pos, vel, obj.data.mass))
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