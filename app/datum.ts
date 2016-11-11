// This 'Datum' class represents a single datum, formatted so it can be
// passed between components and sent to the back-end.

export class Datum {
    datum_id: string;
    Highlight: any[]; // array of arrays, with each child array to be passed to the TextHighlighter.js library
}
