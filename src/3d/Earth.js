import * as THREE from 'three'
import React, { useRef } from 'react'
import { useLoader, useFrame} from '@react-three/fiber'
import {TransformControls, OrbitControls, Stage} from '@react-three/drei'

import useStore from '../store'

import earthImg from '../images/earth.jpg'
import moonImg from '../images/moon.png'
import marsImg from '../images/mars.jpg'
import Button from '../3d/Buttons'
export default function Earth() {

  const groupref = useRef()
  const [earth, moon, mars] = useLoader(THREE.TextureLoader, [earthImg, moonImg, marsImg])

  //subscribe the objects in this components to rotate the mesh on every frame rendered.
  useFrame( (state, delta) => groupref.current.rotation.y  += 0.01 )

  const { fov, position } = useStore( (state) => state.mutation)

  //return the object view (three-js elements expressed in JSX)
  return (
    
    // mars <group ref={ref} scale={[100, 100, 100]} position={[-5000, 0, 5000]}>

    <group 
      ref={groupref} 
      scale={[200, 200, 200]} 
      position={[-4000, 0, 4000]}>

        
        

      {/* earth */}      
      <mesh position={[0,0,0]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial map={earth} roughness={1} fog={false} />
      </mesh>


      {/* moon */}
      <mesh position={[5, 0, 5]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial roughness={1} map={moon} fog={false} />
      </mesh>


      {/* <pointLight position={[-5, -5, -5]} distance={1000} intensity={6} /> */}
      {/* sun 
      <mesh position={[-30, 0, -60]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#FFFF99" fog={false} />
        <pointLight distance={6100} intensity={10} color="white" />1
      </mesh>
*/}
    </group>
  )
}
