export interface NewPlanetData {
    pos: Vec2,
    vel: Vec2,
    mass: number
}

export interface ClientServerMessage<T> {
    intent: string,
    data: T
}

export class Vec2 {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public setLength(mag: number) {
        let scaleF = mag / this.length();
        this.x *= scaleF;
        this.y *= scaleF;
    }

    public add(rhs: Vec2) {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    }

    public sub(rhs: Vec2) {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    }

    public mul(rhs: Vec2) {
        return new Vec2(this.x * rhs.x, this.y * rhs.y);
    }
    public mulS(rhs: number) {
        return new Vec2(this.x * rhs, this.y * rhs);
    }

    public div(rhs: Vec2) {
        return new Vec2(this.x / rhs.x, this.y / rhs.y);
    }
    public divS(rhs: number) {
        return new Vec2(this.x / rhs, this.y / rhs);
    }
}

export class Planet {
    public pos: Vec2;
    public vel: Vec2;
    public mass: number;

    constructor(pos: Vec2, vel: Vec2, mass: number) {
        this.pos = pos;
        this.vel = vel;
        this.mass = mass;
    }

    updatePosition() {
        this.pos = this.pos.add(this.vel.divS(this.mass));
    }
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
              
              let direction = forceActingPlanet.pos.sub(currentPlanet.pos)
              let distance = direction.length();
                    
              let f = this.G * ((currentPlanet.mass * forceActingPlanet.mass)/(distance * distance))
              direction.setLength(f);
              
              currentPlanet.vel = currentPlanet.vel.add(direction);
            }
          }
        
          for (let planet of this.planets) {
            planet.updatePosition()
          }
    }

    getPlanets() {
        return this.planets;
    }
}