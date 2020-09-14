import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../reducer';
import { gaTilJobbsokerkompetanse, gaTilVeiviserarbeidssoker, loggAktivitet } from '../../metrics/metrics';
import JobbsokertipsIkon from './svg/jobbsokertips';
import LenkepanelMedIkon from '../lenkepanel-med-ikon/lenkepanel-med-ikon';
import { jobbsokerkompetanseLenke, veiviserarbeidssokerLenke } from '../../innhold/lenker';
import { OppfolgingContext } from '../../ducks/oppfolging';
import { AmplitudeAktivitetsProps } from '../../metrics/amplitude-utils';

interface StateProps {
    harJobbbsokerbesvarelse: boolean;
}

type AllProps = StateProps & AmplitudeAktivitetsProps;

const Ressurslenker = (props: AllProps) => {
    const { harJobbbsokerbesvarelse, amplitudeAktivitetsData } = props;
    const servicegruppe = React.useContext(OppfolgingContext).data.servicegruppe;

    const URL = harJobbbsokerbesvarelse ? jobbsokerkompetanseLenke : veiviserarbeidssokerLenke;

    const lenketekst = harJobbbsokerbesvarelse
        ? 'jobbsokertips-overskrift-har-besvarelse'
        : 'jobbsokertips-overskrift-har-ikke-besvarelse';

    const gaTil = harJobbbsokerbesvarelse
        ? gaTilJobbsokerkompetanse
        : gaTilVeiviserarbeidssoker;

    const aktivitet = harJobbbsokerbesvarelse
        ? 'Går til jobbsøkerkompetanse'
        : 'Går til veiviser arbeidssøker';

    const handleClick = () => {
        gaTil(servicegruppe);
        loggAktivitet({ aktivitet: aktivitet, ...amplitudeAktivitetsData });
    };

    return (
        <LenkepanelMedIkon
            href={URL}
            alt=""
            onClick={handleClick}
            overskrift={lenketekst}
        >
            <JobbsokertipsIkon/>
        </LenkepanelMedIkon>
    );
}

const mapStateToProps = (state: AppState): StateProps => ({
    harJobbbsokerbesvarelse: state.jobbsokerbesvarelse.harJobbsokerbesvarelse,
});

export default connect(mapStateToProps)(Ressurslenker);
