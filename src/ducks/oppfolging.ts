import {
    ActionType, Handling, HentOppfolgingFEILETAction, HentOppfolgingOKAction, HentOppfolgingPENDINGAction,
} from './actions';
import { Dispatch } from '../dispatch-type';
import { AppState } from '../reducer';
import { hentOppfolgingFetch, DataElement, STATUS } from './api';
import { doThenDispatch } from './api-utils';

export interface State extends DataElement {
    data: Data;
}

export interface Data {
    underOppfolging?: boolean;
    kanReaktiveres?: boolean;
    erSykmeldtMedArbeidsgiver?: boolean;
}

const initialState: State = {
    data: {},
    status: STATUS.NOT_STARTED
};

//  Reducer
export default function reducer(state: State = initialState, action: Handling): State {
    switch (action.type) {
        case ActionType.HENT_OPPFOLGING_PENDING:
            if (state.status === STATUS.OK) {
                return {...state, status: STATUS.RELOADING};
            }
            return {...state, status: STATUS.PENDING};
        case ActionType.HENT_OPPFOLGING_FEILET:
            return {...state, status: STATUS.ERROR};
        case ActionType.HENT_OPPFOLGING_OK: {
            return {...state, status: STATUS.OK, data: action.data.data};
        }
        default:
            return state;
    }
}

export function hentOppfolging(): (dispatch: Dispatch) => Promise<void> {
    return doThenDispatch<State>(() => hentOppfolgingFetch(), {
        ok: hentOppfolgingOk,
        feilet: hentOppfolgingFeilet,
        pending: hentOppfolgingPending,
    });
}

function hentOppfolgingOk(data: State): HentOppfolgingOKAction {
    return {
        type: ActionType.HENT_OPPFOLGING_OK,
        data: data
    };
}

function hentOppfolgingFeilet(): HentOppfolgingFEILETAction {
    return {
        type: ActionType.HENT_OPPFOLGING_FEILET,
    };
}

function hentOppfolgingPending(): HentOppfolgingPENDINGAction {
    return {
        type: ActionType.HENT_OPPFOLGING_PENDING,
    };
}

export function selectOppfolging(state: AppState): State {
    return state.oppfolging;
}