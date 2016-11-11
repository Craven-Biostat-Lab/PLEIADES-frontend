/* 
Define the 'article' data type.

This definition doesn't include all of the fields returned by
the back-end API, but it includes all of the fields that are
used by the front-end.
*/


import { TreatmentEntity } from './treatment-entity';

export class Article {
    PubDate: string;
    Title: string;
    PMCID: string;
    PMID: string;
    treatmentEntities: TreatmentEntity[];
    lastUpdated: number;
}
