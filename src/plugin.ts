import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { SendOSC } from "./actions/send-osc";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the send action.
streamDeck.actions.registerAction(new SendOSC());

// Finally, connect to the Stream Deck.
streamDeck.connect();
