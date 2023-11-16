import React, { useRef, useEffect, useState } from 'react'
import { OrbitControls, CameraShake } from '@react-three/drei'
import { useControls } from 'leva'
import { Particles } from './Particles'
import * as THREE from 'three'

export default function App() {
  const props = useControls({
    focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
    speed: { value: 0.1, min: 0.1, max: 100, step: 0.1 },
    aperture: { value: 1.8, min: 1, max: 5.6, step: 0.1 },
    fov: { value: 50, min: 0, max: 200 },
    curl: { value: 0.25, min: 0.01, max: 0.5, step: 0.01 }
  })

  const meshRef = useRef(null)
  const [rotation, setRotation] = useState(new THREE.Euler())

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    canvas.addEventListener('mousemove', (event) => {
      const mouseX = event.clientX / window.innerWidth
      const mouseY = event.clientY / window.innerHeight

      const dampingFactor = 0.95 // Adjust the damping factor to control the smoothness
      const newRotation = new THREE.Euler(mouseY, mouseX, 0)
      setRotation((prevRotation) => {
        return new THREE.Euler(
          prevRotation.x * dampingFactor + newRotation.x * (1 - dampingFactor),
          prevRotation.y * dampingFactor + newRotation.y * (1 - dampingFactor),
          prevRotation.z * dampingFactor + newRotation.z * (1 - dampingFactor)
        )
      })
    })

    return () => {
      canvas.removeEventListener('mousemove', () => {})
    }
  }, [])

  useEffect(() => {
    meshRef.current.rotation.set(rotation.x, rotation.y, rotation.z)
  }, [rotation])

  return (
    <>
      {/* <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} /> */}
      <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
      <mesh ref={meshRef}>
        <Particles {...props} />
      </mesh>
    </>
  )
}
