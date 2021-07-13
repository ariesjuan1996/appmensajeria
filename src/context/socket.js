import SocketIOClient from 'socket.io-client';
import { SOCKET_URL } from "./config";
import * as React from 'react';
export const socket = SocketIOClient.connect(SOCKET_URL,{ reconnection: true});
export const SocketContext = React.createContext();