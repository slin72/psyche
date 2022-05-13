import React, { useState, Suspense, useEffect } from 'react'
import { ARCanvas, useXR, useXRFrame} from './react-xr/src/XR'
import { DefaultXRControllers } from './react-xr/src/DefaultXRControllers'
//import { DefaultXRControllers, ARCanvas, useXR, useXRFrame} from '@react-three/xr'

import { Stars, DeviceOrientationControls, PerspectiveCamera, OrbitControls, OrthographicCamera } from '@react-three/drei'
import './styles.css'
import { useThree } from '@react-three/fiber'
import { Plane, Sky, Text } from '@react-three/drei'
import * as THREE from 'three'

import Starz from './3d/Stars'
import Solar from './3d/Solar'
import Particles from './3d/Particles'
import Button from './3d/Buttons'
import useStore from './store'



export function App() {

  const actions = useStore( (state) => state.actions)
  const { fov, position} = useStore( (state) => state.mutation)

  function Solarsystem() {
    /*
    const { gl } = useThree()
    useXRFrame((time, xframe) => {
      let refsp = gl.xr.getReferenceSpace()
      let viewerPose = xframe.getViewerPose(refsp)
      //actions.updateCam(viewerPose)
    })
    */
    return (
      <Suspense fallback={null}>
        <Solar/>
      </Suspense>
    )
  }

  return (
    <ARCanvas 
    gl={{ antialias: false }}
    camera={{ position: [-5000, 0, 5000], near: 0.01, far: 100000, fov }}
    //onCreated={({ gl, camera }) => { actions.init(camera) }} 
    > {/* <-- end of ARcanvas config */}

      {/* <DeviceOrientationControls /> */}

      {/* <PerspectiveCamera makeDefault fov={75} position={[0, 0, 16]} near={0.01} far={100000}> */}
        {/* <pointLight intensity={1} position={[-10, -25, -10]} /> */}
        {/* <spotLight castShadow intensity={2.25} angle={0.2} penumbra={1} position={[-25, 20, -15]} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} /> */}
      {/* </PerspectiveCamera> */}

      {/*<OrbitControls autoRotate enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        */}
      <ambientLight intensity={0.25} />
      
        
      <Solarsystem/>
      {/*}
      <Button camera={{ position: [-5000, 0, 5000], near: 0.01, far: 100000, fov }} />
      */}
      {/* <pointLight position={[10, 10, 10]} /> */}
      {/* <Button position={[0, 0.1, -0.2]} /> */}
      <DefaultXRControllers />

      {/* <Stars radius={500} depth={50} count={1000} factor={10} /> */}

      <Particles />
      <Starz />
   


    </ARCanvas>
  )
}
