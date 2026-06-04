// import { Stats } from "./Stats";
// import { useData } from "../hooks/useData";
// import "./styles/Overview.css";

// export const Overview = () => {
//   const { events, infos } = useData();

//   return (
//     <div className="overview">
//       <Stats label={events.label} value={events.quantity} />
//       <Stats label={infos.label} value={infos.quantity} />
//     </div>
//   );
// };


import { Stats } from "./Stats";
import { useData } from "../hooks/useData";
import { useGameState } from "../hooks/useGameState";
import { communicationConnector } from "../../../shared/communicationConnector";
import "./styles/Overview.css";

export const Overview = () => {
  const gameState = useGameState(communicationConnector);

  const data = useData(gameState.events, gameState.infos);

  return (
    <div className="overview">
      <Stats label={data.events.label} value={data.events.quantity} />
      <Stats label={data.infos.label} value={data.infos.quantity} />
    </div>
  );
};