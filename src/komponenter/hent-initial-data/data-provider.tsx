import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../../dispatch-type';
import { AppState } from '../../reducer';
import Innholdslaster from '../innholdslaster/innholdslaster';
import Feilmelding from '../feilmeldinger/feilmelding';
import { hentInnsatsgruppe, State as InnsatsgruppeState } from '../../ducks/innsatsgruppe';
import { hentSykmeldtInfo, State as SykmeldtInfodataState } from '../../ducks/sykmeldt-info';
import { hentUlesteDialoger, State as UlesteDialogerState } from '../../ducks/dialog';
import { ForeslattInnsatsgruppe, selectForeslattInnsatsgruppe } from '../../ducks/brukerregistrering';
import { hentJobbsokerbesvarelse, State as JobbsokerbesvarelseState } from '../../ducks/jobbsokerbesvarelse';
import { hentEgenvurderingbesvarelse, State as EgenvurderingbesvarelseState } from '../../ducks/egenvurdering';
import { hentMotestottebesvarelse, State as MotestottebesvarelseState } from '../../ducks/motestotte';

const skalSjekkeEgenvurderingBesvarelse = (foreslaattInnsatsgruppe: ForeslattInnsatsgruppe | undefined): boolean => {
    return foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.STANDARD_INNSATS ||
        foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.SITUASJONSBESTEMT_INNSATS;
};

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    underOppfolging: boolean;
    innsatsgruppe: InnsatsgruppeState;
    sykmeldtInfo: SykmeldtInfodataState;
    jobbsokerbesvarelse: JobbsokerbesvarelseState;
    ulesteDialoger: UlesteDialogerState;
    foreslaattInnsatsgruppe: ForeslattInnsatsgruppe | undefined;
    egenvurderingbesvarelse: EgenvurderingbesvarelseState;
    motestottebesvarelse: MotestottebesvarelseState;
}

interface DispatchProps {
    hentInnsatsgruppe: () => void;
    hentSykmeldtInfo: () => void;
    hentJobbsokerbesvarelse: () => void;
    hentUlesteDialoger: () => void;
    hentEgenvurderingbesvarelse: () => void;
    hentMotestottebesvarelse: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

const DataProvider = ({
                          children, underOppfolging, foreslaattInnsatsgruppe, innsatsgruppe, sykmeldtInfo, jobbsokerbesvarelse,
                          ulesteDialoger, egenvurderingbesvarelse, hentSykmeldtInfo, hentJobbsokerbesvarelse,
                          hentInnsatsgruppe, hentUlesteDialoger, hentEgenvurderingbesvarelse, hentMotestottebesvarelse
                      }: Props) => {

    React.useEffect(() => {
        hentSykmeldtInfo();
        hentJobbsokerbesvarelse();
        hentInnsatsgruppe();
        hentUlesteDialoger();
        if (skalSjekkeEgenvurderingBesvarelse(foreslaattInnsatsgruppe)) {
            hentEgenvurderingbesvarelse();
        }
        else if(foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.BEHOV_FOR_ARBEIDSEVNEVURDERING){
            hentMotestottebesvarelse();
        }
    }, []);

    const avhengigheter: any[] = [jobbsokerbesvarelse, egenvurderingbesvarelse, sykmeldtInfo]; // tslint:disable-line:no-any
    const ventPa: any[] = [innsatsgruppe, ulesteDialoger]; // tslint:disable-line:no-any
    const betingelser: boolean[] = [underOppfolging, skalSjekkeEgenvurderingBesvarelse(foreslaattInnsatsgruppe), true];

    return (
        <Innholdslaster
            feilmeldingKomponent={<Feilmelding tekstId="feil-i-systemene-beskrivelse"/>}
            storrelse="XXL"
            avhengigheter={avhengigheter}
            ventPa={ventPa}
            betingelser={betingelser}
        >
            {children}
        </Innholdslaster>
    );
}

const mapStateToProps = (state: AppState): StateProps => ({
    underOppfolging: state.oppfolging.data.underOppfolging,
    innsatsgruppe: state.innsatsgruppe,
    sykmeldtInfo: state.sykmeldtInfodata,
    jobbsokerbesvarelse: state.jobbsokerbesvarelse,
    ulesteDialoger: state.ulesteDialoger,
    foreslaattInnsatsgruppe: selectForeslattInnsatsgruppe(state),
    egenvurderingbesvarelse: state.egenvurderingbesvarelse,
    motestottebesvarelse: state.motestottebesvarelse,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    hentInnsatsgruppe: () => hentInnsatsgruppe()(dispatch),
    hentSykmeldtInfo: () => hentSykmeldtInfo()(dispatch),
    hentJobbsokerbesvarelse: () => hentJobbsokerbesvarelse()(dispatch),
    hentUlesteDialoger: () => hentUlesteDialoger()(dispatch),
    hentEgenvurderingbesvarelse: () => hentEgenvurderingbesvarelse()(dispatch),
    hentMotestottebesvarelse: () => hentMotestottebesvarelse()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);
