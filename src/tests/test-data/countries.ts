/** A few countries from the API's reference data (fixtures/reference_data.json). */
export const COUNTRIES = {
  NL: 'Netherlands',
  DE: 'Germany',
  PE: 'Peru',
  ZA: 'South Africa',
} as const;

export type CountryCode = keyof typeof COUNTRIES;
