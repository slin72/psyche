import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {TransformControls, OrbitControls, Stage} from '@react-three/drei'

import marsImg from '../images/mars.jpg'

export default function Planet() {
  const ref = useRef()
  const [ mars ] = useLoader(THREE.TextureLoader, [ marsImg ])

  useFrame( ()=> ref.current.rotation.y  =  ref.current.rotation.y + 0.01 )
 
  return (

    <group ref={ref} scale={[100, 100, 100]} position={[5000, 0, -5000]}>

      {/* mars */}
      <mesh position={[0,0,0]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial map={mars} roughness={1} fog={false} />
      </mesh>

    </group>
  )
}
