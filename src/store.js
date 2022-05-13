import * as THREE from 'three'
import { Curves } from 'three/examples/jsm/curves/CurveExtras'
import { addEffect } from '@react-three/fiber'
import create from 'zustand'
import * as audio from './audio'
import { Curve, Texture, Vector3 } from 'three'

class HelixCurve extends Curve {

	getPoint( t, optionalTarget = new Vector3() ) {

		const point = optionalTarget;

		const a = 80; // radius
		const b = 150; // height

		const t2 = 2 * Math.PI * t * b / 500;

		const x = Math.cos( t2 ) * a;
		const y = Math.sin( t2 ) * a;
		const z = 0;

		return point.set( x+point.x, y+point.y, z+point.z );

	}

}

class Stationary extends Curve {

	getPoint( t, optionalTarget = new Vector3() ) {

		const point = optionalTarget;

		const a = 80; // radius
		const b = 150; // height

		const t2 = 2 * Math.PI * t * b / 500;

		const z = a;
		const x = a;
		const y = 1;

		return point.set( x, y, z );

	}

}


class GrannyKnot extends Curve {

	getPoint( t, optionalTarget = new Vector3() ) {

		const point = optionalTarget;

		t = 2 * Math.PI * t;

		const x = - 0.22 * Math.cos( t ) - 1.28 * Math.sin( t ) - 0.44 * Math.cos( 3 * t ) - 0.78 * Math.sin( 3 * t );
		const y = - 0.1 * Math.cos( 2 * t ) - 0.27 * Math.sin( 2 * t ) + 0.38 * Math.cos( 4 * t ) + 0.46 * Math.sin( 4 * t );
		const z = 0.7 * Math.cos( 3 * t ) - 0.4 * Math.sin( 3 * t );

		return point.set( x, y, z ).multiplyScalar( 20 );

	}

}


let guid = 1

const useStore = create((set, get) => {

  let spline = new GrannyKnot()
  let track = new THREE.TubeBufferGeometry(spline, 250, 0.2, 10, true)
  let spline2 = new HelixCurve()
  let spline3 = new Stationary()
  let track3 = new THREE.TubeBufferGeometry(spline3, 250, 0.2, 10, true)
  let track2 = new THREE.TubeBufferGeometry(spline2, 250, 0.2, 10, true)
  let cancelLaserTO = undefined
  let cancelExplosionTO = undefined
  const box = new THREE.Box3()

  return {
    sound: false,
    camera: undefined,
    points: 0,
    health: 100,
    lasers: [],
    explosions: [],
    rocks: randomData(100, track, 150, 8, () => 1 + Math.random() * 2.5),
    enemies: randomData(10, track, 20, 15, 1),

    mutation: {
      insertion: false,
      t: 0,
      position: new THREE.Vector3(),
      startTime: Date.now(),
      astroid: new THREE.Vector3(),

      track,
      track2,
      track3,
      scale: 15,
      scale2: 5,
      fov: 70,
      hits: false,
      rings: randomRings(30, track),
      particles: randomData(1500, track, 100, 1, () => 0.5 + Math.random() * 0.8),
      looptime: 40 * 1000,
      binormal: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      clock: new THREE.Clock(false),
      mouse: new THREE.Vector2(-250, 50),

      // Re-usable objects
      dummy: new THREE.Object3D(),
      ray: new THREE.Ray(),
      box: new THREE.Box3()
    },

    actions: {
      init(camera) {
        const { mutation, actions } = get()

        set({ camera })
        mutation.clock.start()
        actions.toggleSound(get().sound)

        addEffect(() => {
          const { rocks, enemies } = get()

          const time = Date.now()
          const t = (mutation.t = ((time - mutation.startTime) % mutation.looptime) / mutation.looptime)
          mutation.position = track.parameters.path.getPointAt(t, [3000,0,3000])
          //mutation.position.multiplyScalar(mutation.scale)

          // test for wormhole/warp
          let warping = false
          if (t > 0.3 && t < 0.4) {
            if (!warping) {
              warping = true
              //playAudio(audio.warp)
            }
          } else if (t > 0.5) {
            warping = false
          }



          // test for hits
          //const r = rocks.filter(actions.test)
          //const e = enemies.filter(actions.test)
          //const a = r.concat(e)
          const previous = mutation.hits
          //mutation.hits = a.length
          //if (previous === 0 && mutation.hits) playAudio(audio.click)
          const lasers = get().lasers
          if (mutation.hits && lasers.length && time - lasers[lasers.length - 1] < 100) {
            const updates = a.map((data) => ({ time: Date.now(), ...data }))
            set((state) => ({ explosions: [...state.explosions, ...updates] }))
            clearTimeout(cancelExplosionTO)
            cancelExplosionTO = setTimeout(() => set((state) => ({ explosions: state.explosions.filter(({ time }) => Date.now() - time <= 1000) })), 1000)
            set((state) => ({
              points: state.points + r.length * 100 + e.length * 200,
              rocks: state.rocks.filter((rock) => !r.find((r) => r.guid === rock.guid)),
              enemies: state.enemies.filter((enemy) => !e.find((e) => e.guid === enemy.guid))
            }))
          }
          //if (a.some(data => data.distance < 15)) set(state => ({ health: state.health - 1 }))
        })
      },
      shoot() {
        set((state) => ({ lasers: [...state.lasers, Date.now()] }))
        clearTimeout(cancelLaserTO)
        cancelLaserTO = setTimeout(() => set((state) => ({ lasers: state.lasers.filter((t) => Date.now() - t <= 1000) })), 1000)
        //playAudio(audio.zap, 0.5)
      },
      toggleSound(sound = !get().sound) {
        set({ sound })
        playAudio(audio.engine, 1, true)
        //playAudio(audio.engine2, 0.3, true)
        playAudio(audio.bg, 1, true)
      },
      updateMouse({ clientX: x, clientY: y }) {
        get().mutation.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2)
      },
      test(data) {
        box.min.copy(data.offset)
        box.max.copy(data.offset)
        box.expandByScalar(data.size * data.scale)
        data.hit.set(10000, 10000, 10000)
        const result = get().mutation.ray.intersectBox(box, data.hit)
        data.distance = get().mutation.ray.origin.distanceTo(data.hit)
        return result
      }
    }
  }
})

function randomData(count, track, radius, size, scale) {
  return new Array(count).fill().map(() => {
    const t = Math.random()
    const pos = track.parameters.path.getPointAt(t)
    pos.multiplyScalar(15)
    const offset = pos
      .clone()
      .add(new THREE.Vector3(-radius + Math.random() * radius * 2, -radius + Math.random() * radius * 2, -radius + Math.random() * radius * 2))
    const speed = 0.1 + Math.random()
    return { guid: guid++, scale: typeof scale === 'function' ? scale() : scale, size, offset, pos, speed, radius, t, hit: new THREE.Vector3(), distance: 1000 }
  })
}

function randomRings(count, track) {
  let temp = []
  let t = 0.4
  for (let i = 0; i < count; i++) {
    t += 0.003
    const pos = track.parameters.path.getPointAt(t)
    pos.multiplyScalar(15)
    const segments = track.tangents.length
    const pickt = t * segments
    const pick = Math.floor(pickt)
    const lookAt = track.parameters.path.getPointAt((t + 1 / track.parameters.path.getLength()) % 1).multiplyScalar(15)
    const matrix = new THREE.Matrix4().lookAt(pos, lookAt, track.binormals[pick])
    temp.push([pos.toArray(), matrix])
  }
  return temp
}

function playAudio(audio, volume = 1, loop = false) {
  if (useStore.getState().sound) {
    audio.currentTime = 0
    audio.volume = volume
    audio.loop = loop
    audio.play()
  } else audio.pause()
}

export default useStore
export { audio, playAudio }
