import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Meldekortstatus from './meldekortstatus';
import React from 'react';
import { contextProviders, ProviderProps } from '../../test/test-context-providers';
import { datoUtenTid, plussDager } from '../../utils/date-utils';
import { regexMatcher } from '../../utils/test-utils';

const meldekort = {
    maalformkode: 'NO',
    meldeform: 'EMELD',
    meldekort: [
        {
            meldekortId: 1526772064,
            kortType: 'ELEKTRONISK',
            meldeperiode: {
                fra: '2021-01-18T12:00:00+01:00',
                til: '2021-01-31T12:00:00+01:00',
                kortKanSendesFra: '2021-01-30T12:00:00+01:00',
                kanKortSendes: true,
                periodeKode: '202103',
            },
            meldegruppe: 'ARBS',
            kortStatus: 'OPPRE',
            bruttoBelop: 0.0,
            erForskuddsPeriode: false,
            korrigerbart: true,
        },
    ],
    etterregistrerteMeldekort: [],
    id: '1',
    antallGjenstaaendeFeriedager: 0,
};

const dag0 = datoUtenTid(new Date('2021-02-01T12:00:00+01:00').toISOString());

const providerProps: ProviderProps = {
    meldekort: meldekort,
    brukerInfo: {
        rettighetsgruppe: 'DAGP',
    },
};

describe('tester Meldekortstatus komponenten', () => {
    test('Komponenten vises på dag 1, og har rett varselestekst', () => {
        const dag1 = plussDager(dag0, 1);

        render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps, iDag: dag1 }) });
        expect(
            screen.queryByText(
                /Det er innsending av meldekortet som opprettholder din status som arbeidssøker hos NAV/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(regexMatcher(/Du har 6 dager/i))).toBeInTheDocument();
    });

    test('Komponenten vises på dag 3, og har rett varselestekst', () => {
        const dag3 = plussDager(dag0, 3);

        render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps, iDag: dag3 }) });
        expect(
            screen.queryByText(
                /Det er innsending av meldekortet som opprettholder din status som arbeidssøker hos NAV/i
            )
        ).toBeInTheDocument();
        expect(screen.queryByText(regexMatcher(/Du har 4 dager/i))).toBeInTheDocument();
        expect(screen.queryByText(regexMatcher(/Dersom du ikke sender inn meldekort/i))).toBeInTheDocument();
    });

    test('Komponenten vises på dag 7, og har rett varselestekst', () => {
        const dag7 = plussDager(dag0, 7);

        render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps, iDag: dag7 }) });
        expect(
            screen.queryByText(
                /Det er innsending av meldekortet som opprettholder din status som arbeidssøker hos NAV/i
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText(regexMatcher(/Siste frist for innsending av meldekortet er i kveld klokken 23.00/i))
        ).toBeInTheDocument();
    });

    test('Komponenten vises IKKE ved dag 0', () => {
        const { container } = render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps }) });
        expect(container).toBeEmptyDOMElement();
    });

    test('Komponenten vises IKKE på dag 8', () => {
        const dag8 = plussDager(dag0, 8);

        const { container } = render(<Meldekortstatus />, {
            wrapper: contextProviders({ ...providerProps, iDag: dag8 }),
        });
        expect(container).toBeEmptyDOMElement();
    });

    test('Komponenten vises IKKE ved ingen meldekort', () => {
        const providerProps: ProviderProps = {
            meldekort: { ...meldekort, meldekort: [] },
        };

        const { container } = render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps }) });
        expect(container).toBeEmptyDOMElement();
    });

    test('Setning om at opplysningene er med på å beregne dagpenger vises for rettighetsgruppe DAGP', () => {
        const dag1 = plussDager(dag0, 1);

        render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps, iDag: dag1 }) });
        expect(
            screen.getByText(
                /Opplysningene du oppgir i meldekortet brukes også til å beregne utbetalingen av dagpenger./i
            )
        ).toBeInTheDocument();
    });

    test('Setning om at opplysningene er med på å beregne dagpenger vises for rettighetsgruppe IYT', () => {
        const dag1 = plussDager(dag0, 1);

        render(<Meldekortstatus />, {
            wrapper: contextProviders({ ...providerProps, iDag: dag1, brukerInfo: { rettighetsgruppe: 'IYT' } }),
        });
        expect(
            screen.getByText(
                /Opplysningene du oppgir i meldekortet brukes også til å beregne utbetalingen av dagpenger./i
            )
        ).toBeInTheDocument();
    });

    test('Setning om at opplysningene er med på å beregne dagpenger vises IKKE for rettighetsgruppe AAP', () => {
        const dag1 = plussDager(dag0, 1);

        render(<Meldekortstatus />, {
            wrapper: contextProviders({ ...providerProps, iDag: dag1, brukerInfo: { rettighetsgruppe: 'AAP' } }),
        });
        expect(
            screen.queryByText(
                /Opplysningene du oppgir i meldekortet brukes også til å beregne utbetalingen av dagpenger./i
            )
        ).toBeFalsy();
    });

    test('Setning om at opplysningene er med på å beregne dagpenger vises IKKE for ugyldig rettighetsgruppe', () => {
        const dag1 = plussDager(dag0, 1);

        render(<Meldekortstatus />, {
            wrapper: contextProviders({ ...providerProps, iDag: dag1, brukerInfo: { rettighetsgruppe: 'TEST' } }),
        });
        expect(
            screen.queryByText(
                /Opplysningene du oppgir i meldekortet brukes også til å beregne utbetalingen av dagpenger./i
            )
        ).toBeFalsy();
    });

    test('Setning om at dagpenger stoppes ved ikke innsendt meldekort vises for rettighetsgruppe DAGP fra dag 3 og utover', () => {
        const dag3 = plussDager(dag0, 3);

        render(<Meldekortstatus />, { wrapper: contextProviders({ ...providerProps, iDag: dag3 }) });
        expect(screen.queryByText(/utbetaling av dagpenger stoppes/i)).toBeInTheDocument();
    });

    test('Setning om at dagpengersøknad kan bli avslått vises for rettighetsgruppe IYT fra dag 3 og utover', () => {
        const dag3 = plussDager(dag0, 3);

        render(<Meldekortstatus />, {
            wrapper: contextProviders({ ...providerProps, iDag: dag3, brukerInfo: { rettighetsgruppe: 'IYT' } }),
        });
        expect(screen.queryByText(/en eventuell søknad om dagpenger kan bli avslått/i)).toBeInTheDocument();
    });
});
