import "reflect-metadata";
import { Container } from "inversify";
import { Famicom } from "./famicom";

export function createIOC() {
  const container = new Container();
  container.bind(Famicom).toSelf().inSingletonScope();

  return container;
}
