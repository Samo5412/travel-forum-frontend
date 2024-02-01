/**
 * This interface represents Countries
 */
export interface Country {
    name: string;
    alpha3Code: string;
    nativeName: string;
    population: string;
    region: string;
    subregion: string;
    capital: string;
    flag: string;
    topLevelDomain: string;
    currencies: string;
    languages: string[];
    borderCountries: string[];
    area: number;
    numericCode: string;
    independent: boolean
}
