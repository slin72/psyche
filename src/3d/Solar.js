import * as THREE from 'three'
import React, { useRef } from 'react'
import { useLoader, useFrame} from '@react-three/fiber'
import {TransformControls, OrbitControls, Stage} from '@react-three/drei'

import Sun from './Sun'
import Earth from './Earth'
import Mars from './Mars'
import Rig from './Rig'
//import Ship from './Ship'
import Spacecraft from './Spacecraft'
import Astroid from './Astroid'
import Button from './Buttons'
import useStore from '../store'
//import Track from './Track'



export default function Solar() {

  const groupref = useRef()
  const { fov, position, astroid} = useStore( (state) => state.mutation)


  //subscribe the objects in this components to rotate the mesh on every frame rendered.
  useFrame( (state, delta) => groupref.current.rotation.y  += 0.01 )

  //return the object view (three-js elements expressed in JSX)
  return (

    <group 
      ref={groupref} 
      scale={[1, 1, 1]} 
      position={[0, 0, 0]}
    >

    <Sun/>
    {/* start button */}
    <Button scale={[10,10,10]} position={[-10,0,10]} camera={{ position: [-5000, 0, 5000], near: 0.01, far: 100000, fov }} />

    <Earth/>
    <Mars/>
    <Astroid/>
    <Rig> 
      <Spacecraft/>
    </Rig>

    </group>
  )
}
