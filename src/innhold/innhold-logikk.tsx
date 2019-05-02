import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducer';
import { Servicegruppe, State as ServicegruppeState } from '../ducks/servicegruppe';
import { selectSykmeldtInfo, State as SykmeldtInfoState } from '../ducks/sykmeldt-info';
import {
    ForeslattInnsatsgruppe,
    FremtidigSituasjonSvar, selectForeslattInnsatsgruppe,
    selectFremtidigSituasjonSvar, selectOpprettetRegistreringDato
} from '../ducks/brukerregistrering';
import { seVeientilarbeid } from '../metrics';
import SjekkOppfolging from '../komponenter/hent-initial-data/sjekk-oppfolging';
import './innhold.less';
import InnholdView from './innhold-view';

const LANSERINGSDATO = new Date(2020, 0, 2);

interface StateProps {
    sykmeldtInfo: SykmeldtInfoState;
    servicegruppe: ServicegruppeState;
    fremtidigSvar: FremtidigSituasjonSvar;
    foreslattInnsatsgruppe: ForeslattInnsatsgruppe;
    reservasjonKRR: boolean;
    opprettetRegistreringDato: Date;
}

class InnholdLogikk extends React.Component<StateProps> {

    componentDidMount() {
        const erSykmeldtMedArbeidsgiver = this.props.sykmeldtInfo.data.erSykmeldtMedArbeidsgiver;
        const servicegruppe = this.props.servicegruppe.data.servicegruppe;
        seVeientilarbeid(erSykmeldtMedArbeidsgiver, servicegruppe);
    }

    render() {
        const {sykmeldtInfo, servicegruppe, fremtidigSvar,
            foreslattInnsatsgruppe, reservasjonKRR, opprettetRegistreringDato} = this.props;

        const erSykmeldtMedArbeidsgiver = sykmeldtInfo.data.erSykmeldtMedArbeidsgiver;

        const skalViseTiltaksinfoLenke = (
            erSykmeldtMedArbeidsgiver ||
            servicegruppe.data.servicegruppe === Servicegruppe.BFORM ||
            servicegruppe.data.servicegruppe === Servicegruppe.BATT
        );

        const tilbakeTilSammeArbeidsgiver = (
            fremtidigSvar === FremtidigSituasjonSvar.SAMME_ARBEIDSGIVER ||
            fremtidigSvar === FremtidigSituasjonSvar.SAMME_ARBEIDSGIVER_NY_STILLING
        );

        const visRessurslenker = !(tilbakeTilSammeArbeidsgiver && erSykmeldtMedArbeidsgiver);

        const skalViseEgenvurderingLenke = (
            opprettetRegistreringDato > LANSERINGSDATO &&
            !reservasjonKRR &&
            (foreslattInnsatsgruppe === ForeslattInnsatsgruppe.STANDARD_INNSATS ||
                foreslattInnsatsgruppe === ForeslattInnsatsgruppe.SITUASJONSBESTEMT_INNSATS)
        );

        return (
            <SjekkOppfolging>
                <InnholdView
                    erSykmeldtMedArbeidsgiver={erSykmeldtMedArbeidsgiver}
                    skalViseEgenvurderingLenke={skalViseEgenvurderingLenke}
                    visRessurslenker={visRessurslenker}
                    skalViseTiltaksinfoLenke={skalViseTiltaksinfoLenke}
                />
            </SjekkOppfolging>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    sykmeldtInfo: selectSykmeldtInfo(state),
    servicegruppe: state.servicegruppe,
    fremtidigSvar: selectFremtidigSituasjonSvar(state),
    reservasjonKRR: state.oppfolging.data.reservasjonKRR,
    foreslattInnsatsgruppe: selectForeslattInnsatsgruppe(state),
    opprettetRegistreringDato: new Date(selectOpprettetRegistreringDato(state)),

});

export default connect(mapStateToProps)(InnholdLogikk);