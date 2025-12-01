import {IPlanet} from "@/app/store/iPlanet";

export interface IPlanetApiResponse {
    results?: IPlanet[];
    count?: number;
    previous?: string | null;
    next?: string | null;
}
