
/*
This service handles information shared between the article-datums component
and article-text component when the user is editing hilights.  This includes
the selected datum, the selected hilight mode (add or remove,) and the edited
highlights that have been made by the user.

This service also handles the submission of the edited datums to the back-end.

It would have been easier to do this using @Input, but that made the iframe 
reload every time the user selected a datum.  This is kind of a workaround.
See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
*/

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import { Article } from './article';
import { Datum } from './datum';

@Injectable()
export class DatumEditService {

    constructor(private http: Http) {}


    // Currently selected datum
    private selectedDatum: Datum;

    // Event stream for selected datum, an event is fired every time a new datum is selected.
    private datumSelectSource = new Subject<Datum>();
    
    // Outside classes can subscribe to this event stream, but since it's an observable and not a subject, events can only be fired from inside this class.
    datumSelectSource$ = this.datumSelectSource.asObservable();
    
    // Update the currently selected datum, and fire an event showing that the datum has changed
    selectDatum(datum: Datum): void {
        this.selectedDatum = datum;
        this.datumSelectSource.next(datum);
    }
    
    
    
    
    
    // Event stream for highlight mode, an event is fired every time the highlight mode is toggled.
    private highlightModeSource = new Subject<string>();
    
    highlightModeSource$ = this.highlightModeSource.asObservable();
    
    setHighlightMode(mode: string): void {
        this.highlightModeSource.next(mode);
    }
    
    
    
    
    // Mark the edits made by the user in their respective Datum objects, and
    // keep track of which datums the user has edited.
    //
    // Keep a dict like this: {datum_id : {datum info, plus Highlights: [....]}}
    private datumsWithEdits = {};
    
    markHighlights(highlights: string): void {
        if (this.selectedDatum) {    
            this.selectedDatum.Highlight = JSON.parse(highlights);
            this.datumsWithEdits[this.selectedDatum.datum_id] = this.selectedDatum;
        }
    }
    
    
    // Return true if the user has made any edits, yet, false otherwise.
    anyChanges(): boolean {
        return Object.keys(this.datumsWithEdits).length > 0;
    }
    
    
    
    
    // Record when the user opens the article
    private articleOpenTime: number;
    setArticleOpenTime(): void {
        this.articleOpenTime = Date.now();
    }
    
    
    
    
    // Send the edited datums with highlights to the server, via an HTTP PUT with a JSON payload.
    // Also takes a callback function, to call when the request has completed.
    submitEdits(article: Article, callback: ()=>void): void {
    
        // Only submit if the user has made some edits.
        if (this.anyChanges()) {
    
            let url = '/api/v01/datums';
            let headers = new Headers({'Content-Type': 'application/json'});
        
            // Convert datumsWithEdits to an array, get rid of dictionary keys
            let datums = Object.keys(this.datumsWithEdits).map(datum_id => this.datumsWithEdits[datum_id]);
        
            /*
            console.log('Submitting hilights');
            console.log(datums);
            */
        
            // Make an HTTP PUT request to the back-end
            this.http.put(
                url, 
                JSON.stringify({
                    articleOpenTime: this.articleOpenTime,
                    submitTime: Date.now(),
                    datums: datums,
                    PMCID: article.PMCID,
                    PMID:  article.PMID,
                    }),
                {headers: headers}
            ).toPromise()
            .then(response => callback()); // When we get a response, call the callback)
            
        }
        
        // Call the callback even if the user didn't have any edits to submit
        callback();
    }
    
}
