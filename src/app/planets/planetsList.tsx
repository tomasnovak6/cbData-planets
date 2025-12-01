"use client";
import {JSX, useCallback, useEffect, useRef} from "react";
import { usePlanetStore } from "@/app/store/planetStore";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import dayjs from "dayjs";
import {t} from "./../i18n";

export default function PlanetsList(): JSX.Element {
    const {
        planets,
        total,
        loading,
        error,
        pageSize,
        fetchPlanets,
        refresh,
        page,
        setPage,
    } = usePlanetStore();

    const first = (page - 1) * pageSize;

    const lastRefreshRef = useRef(0);

    const handlePageChange = useCallback(
        (event: DataTablePageEvent) => {
            const nextPage = (event.page ?? 0) + 1;
            setPage(nextPage);
        },
        [setPage],
    );

    const handleRefreshClick = () => {
        const now = Date.now();
        if (loading) return;
        if (now - lastRefreshRef.current < 1000) return;
        lastRefreshRef.current = now;
        refresh();
    };

    useEffect(() => {
        if (!planets.length) {
            void fetchPlanets();
        }
    }, [fetchPlanets, planets.length]);


    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-4 w-100">
                <h1 className="m-0">{t('headline')}</h1>

                <Button
                    icon="pi pi-refresh"
                    label={t('buttons.refresh')}
                    severity="info"
                    onClick={handleRefreshClick}
                    outlined
                />
            </div>

            {loading && (
                <div className="flex items-center gap-3 mb-4">
                    <ProgressSpinner style={{ width: "30px", height: "30px" }} />
                    <span>{t('common.loadingData')}</span>
                </div>
            )}

            {error && (
                <div className="mb-4">
                    <Message
                        severity="error"
                        text={error || t('common.loadingDataError')}
                    />
                    <div className="mt-2">
                        <Button label={'button.refresh'} onClick={refresh} />
                    </div>
                </div>
            )}

            {!loading && !error && (
                <DataTable
                    value={planets ?? []}
                    paginator
                    rows={pageSize}
                    first={first}
                    onPage={handlePageChange}
                    totalRecords={total}
                    stripedRows
                    showGridlines
                    emptyMessage={'common.noData'}
                >
                    <Column
                        field="name"
                        header={t('columns.name')}
                        sortable
                    />
                    <Column
                        field="rotation_period"
                        header={t('columns.rotation_period')}
                    />
                    <Column
                        field="orbital_period"
                        header={t('columns.orbital_period')}
                    />
                    <Column
                        field="terrain"
                        header={t('columns.terrain')}
                    />
                    <Column
                        field="created"
                        header={t('columns.created')}
                        body={(row) => dayjs(row.created).format("DD.MM.YYYY HH:mm:ss")}
                    />
                </DataTable>
            )}
        </>
    );
}
