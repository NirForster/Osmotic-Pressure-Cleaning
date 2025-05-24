import Lottie from "lottie-react";
import waterLoader1 from "../src/assets/waterLoader1.json";

function App() {
  return (
    <div>
      {" "}
      <Lottie
        animationData={waterLoader1}
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
      <h1>Hello Ben Gigi!</h1>
    </div>
  );
}

export default App;
