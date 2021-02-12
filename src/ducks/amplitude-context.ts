import React from 'react';
import { AmplitudeData } from '../metrics/amplitude-utils';
import { InnloggingsNiva } from '../ducks/autentisering';

export const initialState: AmplitudeData = {
    gruppe: 'boo',
    geografiskTilknytning: 'INGEN_VERDI',
    isKSSX: 'nei',
    isKSSK: 'nei',
    ukerRegistrert: 0,
    nivaa: InnloggingsNiva.LEVEL_3,
    kanReaktiveres: 'nei',
    formidlingsgruppe: 'INGEN_VERDI',
    servicegruppe: 'IVURD',
    rettighetsgruppe: 'INGEN_VERDI',
    registreringType: 'INGEN_VERDI',
    underOppfolging: 'nei',
    antallDagerEtterFastsattMeldingsdag: 'ikke meldekortbruker',
    gitVersion: 'INGEN_VERDI',
    buildTimestamp: new Date().toISOString(),
    antallSynligeInfomeldinger: 0,
    erSykmeldtMedArbeidsgiver: 'ukjent',
    dinSituasjon: 'ukjent',
    reservasjonKRR: 'ukjent',
};

export const AmplitudeContext = React.createContext<AmplitudeData>(initialState);