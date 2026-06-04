import { container } from "tsyringe";
import { CommunicationConnectorToken } from "../types/services/communication-connector-service-base";

export const communicationConnector =
  container.resolve(CommunicationConnectorToken);