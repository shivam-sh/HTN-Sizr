import React, { Suspense, useRef } from "react";
import "./App.scss";
// Components
import Header from "./components/header";
import { Section } from "./components/section";
import { Canvas, useFrame } from "react-three-fiber";

import { Html, useGLTFLoader, RoundedBox } from "drei";

const HTMLContent = () => {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y += 0.005;
    ref.current.rotation.z = 0;
    //ref.current.rotation.x += 0.001
  });

  return (
    <>
      <mesh ref={ref} position={[0, 0, -100]}>
        <Model />
      </mesh>

      <Html fullscreen>
        <div className="container">
          <h1 className="title">Shopping for shoes online, made simple.</h1>
        </div>
      </Html>
    </>
  );
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight intensity={1} positon={[1000, 0, 0]} />
    </>
  );
};

const Model = () => {
  const gltf = useGLTFLoader("/scene.gltf", true);

  return <primitive object={gltf.scene} dispode={null} />;
};

function Home() {
  return (
    <div className="container">
      <h1 className="title">Shopping for shoes online, made simple.</h1>
    </div>
  );
}
export default Home;
