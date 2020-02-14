import * as React from 'react';
import { seVeientilarbeidNiva3 } from '../metrics/metrics';
import './innhold.less';
import InnholdView from './innhold-view';

const InnholdLogikkNiva3 = () => {

    React.useEffect(() => {
        seVeientilarbeidNiva3();
    }, []);

    return (
        <InnholdView
            erSykmeldtMedArbeidsgiver={false}
            skalViseKrrMelding={false}
            skalViseEgenvurderingLenke={false}
            visRessurslenker={true}
            skalViseMotestotteLenke={false}
            skalViseIARBSPlaster={false}
            skalViseRegistrert={false}
        />
    );
};

export default InnholdLogikkNiva3;
