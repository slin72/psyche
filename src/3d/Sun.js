import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {TransformControls, OrbitControls, Stage} from '@react-three/drei'


export default function Sun() {
  const ref = useRef()

  useFrame( ()=> ref.current.rotation.y  =  ref.current.rotation.y + 0.01 )
 
  return (

    <group ref={ref} scale={[100, 100, 100]} position={[0, 0, 0]}>

      {/* the sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#FFFF99" fog={false} />
        <pointLight distance={6100} intensity={10} color="white" />1
      </mesh>

    </group>
  )
}
