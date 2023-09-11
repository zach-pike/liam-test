import { Planet, PlanetManager, Vec2 } from "./planet"

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

  client = new WebSocket("ws://localhost:8081");

  client.onmessage = (m) => {
    let data = JSON.parse(m.data);
    let p = [];

    data.forEach((v) => {
      let pos = new Vec2(v.pos.x, v.pos.y);
      let vel = new Vec2(v.vel.x, v.vel.y);

      p.push(new Planet(pos, vel, v.mass))
    })
    console.log(p)
    manager.setPlanetsArray(p);
  }
}

window.onclick = () => {
  addPlanet(new Vec2(100, 100), new Vec2(0, 0), 500);
  addPlanet(new Vec2(250, 100), new Vec2(0, -200), 100);
}

window.draw = () => {
  background(0);
  manager.planetUpdate();

  for (let planet of manager.getPlanets()) {
    circle((planet.pos.x/2)+width/2, (planet.pos.y/2)+height/2, planet.mass/5, (255/planet.mass))
  }
}