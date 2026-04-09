import { countries } from 'country-data-list';

export type CountryOption = {
  id: number;
  name: string;
  alpha2: string;
  alpha3: string;
  dialCode: string;
};

interface RawCountry {
  name: string;
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
}

export const getCountriesWithDialCodes = (): CountryOption[] => {
  return (countries.all as RawCountry[])
    .filter((country: RawCountry) => country.countryCallingCodes && country.countryCallingCodes.length > 0)
    .map((country: RawCountry, index: number) => ({
      id: index,
      name: country.name,
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      dialCode: country.countryCallingCodes[0], // Use primary calling code
    }))
    .sort((a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name));
};
