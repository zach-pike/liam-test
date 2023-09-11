import { PlanetManager, divVecScalar, subVec } from "../server/lib/planet"

let manager = new PlanetManager();
let client = null;

let startpoint = null;

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

window.mousePressed = () => {
  startpoint = { x: window.mouseX, y: window.mouseY };
  console.log(startpoint);
}

window.mouseReleased = () => {
  let endpoint = { x: window.mouseX, y: window.mouseY };

  let direction = subVec(startpoint, endpoint);

  addPlanet(startpoint, direction, 100)
  manager.addPlanet({ pos: startpoint, vel: direction, mass: 100 });
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

window.draw = () => {
  background(0);
  manager.planetUpdate();

  for (let planet of manager.getPlanets()) {
    circle(planet.pos.x, planet.pos.y, planet.mass/5, (255/planet.mass))
  }
}