import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import streamDeck from "@elgato/streamdeck";
import dgram from "node:dgram";
import net from "node:net";
import osc from "../utils/osc";
import slip from "../utils/slip";

@action({ UUID: "com.jwetzell.osc.send" })
export class SendOSC extends SingletonAction<SendOSCSettings> {
  override async onKeyDown(ev: KeyDownEvent<SendOSCSettings>): Promise<void> {
    const { settings } = ev.payload;
    streamDeck.logger.debug(settings);

    const protocol = settings.protocol || "udp";

    if (settings.host && settings.port && settings.address) {
      const port = Number.parseInt(settings.port);

      let oscMessageBuffer = osc.toBuffer({
        address: settings.address,
        args: [],
      });

      if (settings.slip) {
        oscMessageBuffer = slip.encode(oscMessageBuffer);
      }

      if (protocol === "tcp") {
        const client = new net.Socket();
        client.on("error", (error) => {
          streamDeck.logger.error(error);
        });

        client.connect(port, settings.host, () => {
          client.write(oscMessageBuffer, () => {
            client.destroy();
          });
        });
      } else if (protocol === "udp") {
        const client = dgram.createSocket("udp4");
        client.send(oscMessageBuffer, port, settings.host, (error) => {
          if (error) {
            streamDeck.logger.error(error);
          }
          client.close();
        });
      }
    }
  }
}

type SendOSCSettings = {
  host?: string;
  port?: string;
  address?: string;
  protocol?: "tcp" | "udp";
  slip?: boolean;
};
