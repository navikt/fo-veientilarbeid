import {DataElement, STATUS} from './api';
import React from 'react';

export interface State extends DataElement {
    data: Data;
}

interface MeldeperiodeInn {
    fra?: string
    til?: string
    kortKanSendesFra?: string
    kanKortSendes?: boolean
    periodeKode?: string
}

interface Meldekort {
    mottattDato?: string | null
    meldeperiode?: MeldeperiodeInn | null
}

export interface Data {
    meldekort?: Meldekort[];
}

export const initialState: State = {
    data:{},
    status: STATUS.NOT_STARTED,
};

export const MeldekortContext = React.createContext<State>(initialState);