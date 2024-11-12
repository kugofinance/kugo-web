// import {
//   Environment,
//   OrbitControls,
//   Lightformer,
//   Stats,
// } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
// import { Suspense } from "react";
// import { Model } from "./model";

// export const Scene = () => {
//   return (
//     <Canvas
//       style={{
//         width: "100vw",
//         height: "100vh",
//         position: "absolute",
//         left: "0",
//         zIndex: "-1",
//       }}
//       camera={{ fov: 70, position: [50, 0, 70] }}>
//       <Suspense>
//         <Model />
//       </Suspense>
//       <Environment resolution={256}>
//         <group rotation={[-Math.PI / 2, 0, 0]}>
//           <Lightformer
//             intensity={1}
//             rotation-x={Math.PI / 2}
//             position={[0, 5, -9]}
//             scale={[10, 10, 1]}
//           />
//           <Lightformer
//             intensity={5}
//             rotation-y={Math.PI / 2}
//             position={[-5, 1, -1]}
//             scale={[10, 2, 1]}
//           />
//           <Lightformer
//             intensity={50}
//             rotation-y={Math.PI / 2}
//             position={[-5, -1, -1]}
//             scale={[10, 2, 1]}
//           />
//           <Lightformer
//             intensity={1}
//             rotation-y={-Math.PI / 2}
//             position={[10, 1, 0]}
//             scale={[20, 2, 1]}
//           />
//           <Lightformer
//             type="ring"
//             intensity={5}
//             rotation-y={Math.PI / 2}
//             position={[-0.1, -1, -5]}
//             scale={10}
//           />
//         </group>
//       </Environment>
//       <Stats />
//       <OrbitControls />
//     </Canvas>
//   );
// };
