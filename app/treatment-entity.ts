
// This class represents the datums returned by the server, grouped by treatment entity.
// Too lazy to create all the classes to describe this nested structure,
// See the 'group_by_entity' and 'get_articles' functions in the back-end script.

export class TreatmentEntity {
    TreatmentEntity: any;
    TreatmentTypes: any;
    TreatmentTests: any;  
}
