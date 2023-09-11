import { PlanetManager, divVecScalar, subVec } from "../server/lib/planet"

let manager = new PlanetManager();
let client = null;

let startpoint = null;
let createMass = 0;

let slider = document.querySelector("#mass");
let masstxt = document.querySelector("#masstxt");

function sliderUpdate() {
  masstxt.textContent = slider.value;
  createMass = parseInt(slider.value);
}

sliderUpdate();
slider.addEventListener("change", sliderUpdate);

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

  addPlanet(startpoint, direction, createMass)
  manager.addPlanet({ pos: startpoint, vel: direction, mass: createMass });
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