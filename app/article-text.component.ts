/*
This component shows the full text for an article in an iframe, and interfaces
with the TextHighligher.js library to handles hilighting interactions.

The selected article is recieved as an input from the parent controller.

Other state information, including the the selected datum, the highlight
mode (add or remove,) and the edits made by the user are stored asynchronously
in the datum-edit service, instead of being a part of this component's state. 
This is a workaround to a bug where the iframe's contents were re-rendered every
time the component state changed.
See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
*/


import { Component, Input, ChangeDetectionStrategy, OnDestroy, AfterContentInit } from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Subscription }   from 'rxjs/Subscription';

import { Article } from './article';
import { ArticleService } from './article.service';
import { Datum } from './datum';
import { DatumEditService } from './datum-edit.service';


// Tell the TypeScript transpiler about the TextHighlighter library.  
// (TextHilighter.js is included in index.html.)
declare var TextHighlighter: any;


@Component({
    moduleId: module.id,
    selector: 'article-text',
    templateUrl: 'article-text.component.html',
    styleUrls: ['article-text.component.css'],
    
    // Only detect changes when this component's inputs are changed.
    // This is required to fix the iframe-reloading bug.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTextComponent implements OnDestroy {



    // Currently selected article
    @Input()
    article: Article;
    
    
    // This service fires an event whenever a datum is selected.
    // We can't have the selected datum just be an input/property of this class, because it would force the template to re-render and reload the iframe every time the selected datum changed.  So we get around this by putting the selected datum into an asynchronous service.
    // Same goes for the highlight mode (add vs. reomve).
    datumSelectSubscription: Subscription;  
    highlightModeSubscription: Subscription;
    
    
    // Text Highlighter object
    textHighlighter: any;
    
    
    
    
    
    constructor(
      private articleService: ArticleService,
      private sanitizer: DomSanitizer,
      private datumEditService: DatumEditService,
    ) {
    
    
        // Call this function when the user selects a datum.
        // (An event will be fired through this observable.)
        this.datumSelectSubscription = datumEditService.datumSelectSource$.subscribe(
            datum => {
                console.log('Datum selected!');
                console.log(datum);
                
                // Draw hilights on the article.
                this.hltr().removeHighlights();
                this.hltr().deserializeHighlights(JSON.stringify(datum.Highlight));
        
            });
    
    
    
        // Call this function each time the user changes the hilight mode
        // (An event will be fired through this observable.)
        this.highlightModeSubscription = datumEditService.highlightModeSource$.subscribe(
          highlightMode => {
                if (highlightMode == 'add') {
                    this.hltr().setColor('#FFFF7B');
                }
                else {
                    this.hltr().setColor('#F8F8F8');
                }
        
          });
    }
    
    
    
    
    // Return the article text URL to load in the iframe.
    // This marks the URL as safe for Angular's XSS-attack prevention feature.
    articleUrl(): SafeUrl {
        let url = '';
        
        if (this.article) {
            url  = '/article-text/' + this.article.PMCID + '/' + this.article.PMCID + '.html';
        }
        
        // mark the Url as safe from XSS attacks
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    
    
    
    
    // Return the TextHighlighter object.
    // If it doesn't already exist, create a new one for the iframe document body.
    
    // (This is a weird hack, because for some reason I couldn't get any of the Angular lifecycle hooks
    // to fire after the iframe was rendered.  This will get called when the user selects a datum, by
    // when the iframe should definitely exist.)
    
    hltr(): any {
        if (this.textHighlighter) {
            return this.textHighlighter;
        }
         
        else {
            // Select the iframe document body.
            let frameBody = (document.querySelector('iframe#article-frame') as any).contentDocument.body;
            
            this.textHighlighter = new TextHighlighter(frameBody, {
            
                // When the TextHighlighter.js detects that the user has changed the hilights, store the
                // new highlights for this datum in the datum-edit service.
                onAfterHighlight: () => {
                    this.datumEditService.markHighlights(this.textHighlighter.serializeHighlights());
                },
            });
            return this.textHighlighter;
        }
         
    }
    
    
    


    // This is neccessary to prevent memory leaks.
    // Unsubscribe from the service when this component is destroyed.
    ngOnDestroy(): void {
        this.datumSelectSubscription.unsubscribe();
        this.highlightModeSubscription.unsubscribe();
    }


}
