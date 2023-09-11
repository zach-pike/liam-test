export interface NewPlanetData {
    pos: Vec2,
    vel: Vec2,
    mass: number
}

export interface ClientServerMessage<T> {
    intent: string,
    data: T
}

export interface Vec2 {
    x: number,
    y: number
}

export interface Planet {
    pos: Vec2,
    vel: Vec2,
    mass: number
}

export function getVecLength(b: Vec2) { return Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2)); }

export function setVecLength(v: Vec2, mag: number) {
    let scaleF = mag / getVecLength(v);
    v.x *= scaleF;
    v.y *= scaleF;
}

export function addVec(lhs: Vec2, rhs: Vec2) { return { x: lhs.x + rhs.x, y: lhs.y + rhs.y }; }
export function subVec(lhs: Vec2, rhs: Vec2) { return { x: lhs.x - rhs.x, y: lhs.y - rhs.y }; }
export function mulVec(lhs: Vec2, rhs: Vec2) { return { x: lhs.x * rhs.x, y: lhs.y * rhs.y }; }
export function mulVecScalar(lhs: Vec2, rhs: number) { return { x: lhs.x * rhs, y: lhs.y * rhs }; }
export function divVec(lhs: Vec2, rhs: Vec2) { return { x: lhs.x / rhs.x, y: lhs.y / rhs.y }; }
export function divVecScalar(lhs: Vec2, rhs: number) { return { x: lhs.x / rhs, y: lhs.y / rhs }; }

export function updatePlanetPosition(planet: Planet) {
    planet.pos = addVec(planet.pos, divVecScalar(planet.vel, planet.mass));
}

export class PlanetManager {
    planets: Planet[] = []
    public G: number = 1;

    constructor() {}

    addPlanet(planet: Planet) {
        this.planets.push(planet);
    }

    setPlanetsArray(planets: Planet[]) {
        this.planets = planets;
    }

    planetUpdate() {
        for (let currentPlanet of this.planets) {
            for (let forceActingPlanet of this.planets) {
              if (currentPlanet == forceActingPlanet) continue;    
              
              let direction = subVec(forceActingPlanet.pos, currentPlanet.pos)
              let distance = getVecLength(direction);
                    
              let f = this.G * ((currentPlanet.mass * forceActingPlanet.mass)/(distance * distance))
              setVecLength(direction, f);
              
              currentPlanet.vel = addVec(currentPlanet.vel, direction);
            }
          }
        
          for (let planet of this.planets) {
            updatePlanetPosition(planet);
          }
    }

    getPlanets() {
        return this.planets;
    }
}