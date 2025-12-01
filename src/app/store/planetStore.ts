"use client";

import { create } from "zustand";
import { IPlanet } from "@/app/store/iPlanet";
import { IPlanetApiResponse } from "@/app/store/iPlanetApiResponse";
import {t} from "i18next";

interface IPlanetStore {
    planets: IPlanet[];
    total: number;
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;

    fetchPlanets: () => Promise<void>;
    refresh: () => void;
    setPage: (page: number) => void;
}

export const usePlanetStore = create<IPlanetStore>((set, get) => ({
    planets: [],
    total: 0,
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,

    fetchPlanets: async () => {
        set({ loading: true, error: null });

        try {
            const url = "https://swapi.info/api/planets";
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(t('common.unknownError'));
            }

            const data: IPlanetApiResponse | IPlanet[] = await response.json();

            let planets: IPlanet[] = [];
            let total = 0;

            if (!Array.isArray(data) && Array.isArray(data.results)) {
                planets = data.results;
                total = typeof data.count === "number" ? data.count : data.results.length;
            } else if (Array.isArray(data)) {
                planets = data;
                total = data.length;
            } else {
                planets = data ? [data as IPlanet] : [];
                total = planets.length;
            }

            set({
                planets,
                total,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : t('common.unknownError'),
            });
        } finally {
            set({ loading: false });
        }
    },

    refresh: () => {
        const { loading, fetchPlanets } = get();

        if (loading) {
            return;
        }

        set({ page: 1 });
        void fetchPlanets();
    },

    setPage: (page) => set({ page }),
}));
