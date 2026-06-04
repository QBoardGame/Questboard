import { useEffect, useState } from "react";

type GameSnapshot = {
  events: any[];
  infos: any[];
  updatedAt: number;
};

export const useGameState = (connector: any) => {
  const [state, setState] = useState<GameSnapshot>({
    events: [],
    infos: [],
    updatedAt: 0,
  });

  useEffect(() => {
    const handler = (message: any) => {
      if (message.type === "GAME_STATE_UPDATE") {
        setState(message.payload);
      }
    };

    connector.on("messageReceived", handler);

    return () => {
      connector.off("messageReceived", handler);
    };
  }, [connector]);

  return state;
};