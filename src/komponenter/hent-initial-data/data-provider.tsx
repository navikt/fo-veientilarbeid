import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../../dispatch-type';
import { AppState } from '../../reducer';
import Innholdslaster from '../innholdslaster/innholdslaster';
import Feilmelding from '../feilmeldinger/feilmelding';
import { State as OppfolgingState } from '../../ducks/oppfolging';
import { hentServicegruppe, State as ServicegruppeState } from '../../ducks/servicegruppe';
import { hentSykmeldtInfo, State as SykmeldtInfodataState } from '../../ducks/sykmeldt-info';
import { hentUlesteDialoger, State as UlesteDialogerState } from '../../ducks/dialog';
import { hentBrukerRegistrering, State as BrukerRegistreringState } from '../../ducks/brukerregistrering';
import { hentJobbsokerbesvarelse, State as JobbsokerbesvarelseState } from '../../ducks/jobbsokerbesvarelse';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    oppfolging: OppfolgingState;
    servicegruppe: ServicegruppeState;
    sykmeldtInfo: SykmeldtInfodataState;
    jobbsokerbesvarelse: JobbsokerbesvarelseState;
    ulesteDialoger: UlesteDialogerState;
    brukerRegistrering: BrukerRegistreringState;
}

interface DispatchProps {
    hentServicegruppe: () => void;
    hentSykmeldtInfo: () => void;
    hentJobbsokerbesvarelse: () => void;
    hentUlesteDialoger: () => void;
    hentBrukerRegistrering: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

class DataProvider extends React.Component<Props> {

    componentWillMount() {
        this.props.hentSykmeldtInfo();
        this.props.hentJobbsokerbesvarelse();
        this.props.hentServicegruppe();
        this.props.hentUlesteDialoger();
        this.props.hentBrukerRegistrering();
    }

    render() {
        const {
            children, servicegruppe, sykmeldtInfo, jobbsokerbesvarelse, ulesteDialoger, brukerRegistrering
        } = this.props;

        const avhengigheter: any[] = [sykmeldtInfo]; // tslint:disable-line:no-any
        const ventPa: any[] = [servicegruppe, jobbsokerbesvarelse, ulesteDialoger, brukerRegistrering]; // tslint:disable-line:no-any

        return (
            <Innholdslaster
                feilmeldingKomponent={<Feilmelding tekstId="feil-i-systemene-beskrivelse"/>}
                storrelse="XXL"
                avhengigheter={avhengigheter}
                ventPa={ventPa}
            >
                {children}
            </Innholdslaster>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    oppfolging: state.oppfolging,
    servicegruppe: state.servicegruppe,
    sykmeldtInfo: state.sykmeldtInfodata,
    jobbsokerbesvarelse: state.jobbsokerbesvarelse,
    ulesteDialoger: state.ulesteDialoger,
    brukerRegistrering: state.brukerRegistrering,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    hentServicegruppe: () => hentServicegruppe()(dispatch),
    hentSykmeldtInfo: () => hentSykmeldtInfo()(dispatch),
    hentJobbsokerbesvarelse: () => hentJobbsokerbesvarelse()(dispatch),
    hentUlesteDialoger: () => hentUlesteDialoger()(dispatch),
    hentBrukerRegistrering: () => hentBrukerRegistrering()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);