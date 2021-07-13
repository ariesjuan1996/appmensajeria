
import { SOCKET_URL } from "./config";
import * as React from 'react';
import moment from 'moment';
moment.locale('es-ES');
export const momentGlobal = moment;
export const MomentContext = React.createContext();