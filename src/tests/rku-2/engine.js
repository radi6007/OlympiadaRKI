import { TEST, PARTS, Q } from "./data.js";
import { startTest } from "../engine.js";
import { sourceCopy } from "../source-copy.js";
startTest({ TEST, PARTS, Q, copy: sourceCopy(TEST, PARTS), audioPath: "/assets/rku-2.mp3", realtimeAudio: true });
