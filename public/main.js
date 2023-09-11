import { PlanetManager } from "../server/lib/planet"

let manager = new PlanetManager();
let client = null;

function addPlanet(pos, vel, mass) {
  client.send(JSON.stringify({
    intent: 'addPlanet',
    data: {
      pos,
      vel,
      mass
    }
  }))
}

window.setup = () => {
  createCanvas(700, 700);
  background(0);
  frameRate(60);

  client = new WebSocket(`ws://${window.location.hostname}:8081`);

  client.onmessage = (m) => {
    manager.setPlanetsArray(JSON.parse(m.data));
  }
}

window.onclick = () => {
  addPlanet({x: 100, y: 100 }, { x: 0, y: 0 }, 500);
  addPlanet({ x: 250, y: 100 }, { x: 0, y: -200 }, 100);
}

window.draw = () => {
  background(0);
  manager.planetUpdate();

  for (let planet of manager.getPlanets()) {
    circle((planet.pos.x/2)+width/2, (planet.pos.y/2)+height/2, planet.mass/5, (255/planet.mass))
  }
}