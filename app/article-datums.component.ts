/*
This component shows the user a list of datums for the selected article,
and allows the user to select a datum.  It also includes the UI buttons
for submitting, and toggling add/remove hilights.  The selected article 
is identified from the URL path.

This component includes the article-text component as a child.

The current state of the UI for this page, including the selected datum
and add/remove hilight mode, is communicated asynchronously with the 
article-text component via the datum-edit service, instead of directly
made an attribute of the article-text component.  This is to prevent a bug
where the iframe reloads every time a new datum is selected.

See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
*/


import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Router } from '@angular/router';

import { Article } from './article';
import { ArticleService } from './article.service';
import { Datum } from './datum';
import { DatumEditService } from './datum-edit.service';

@Component({
    moduleId: module.id,
    selector: 'article-datums',
    templateUrl: 'article-datums.component.html',
    styleUrls: [ 'article-datums.component.css' ],
    providers: [ DatumEditService ],
})
export class ArticleDatumsComponent implements OnInit {


    // Currently selected article
    article: Article;
    
    // Currently selected datum
    selectedDatum: Datum;    
    
    // Current hilight mode
    highlightMode: string = 'add';  // 'add' or 'remove'
    
    constructor(
      private articleService: ArticleService,
      private route: ActivatedRoute,
      private location: Location,
      private router: Router,
      private datumEditService: DatumEditService,
    ) {}
    
    
    // Load the article JSON from the server when the component initiates
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let PMCID = params['PMCID'];
            this.articleService.getArticle(PMCID)
                .then(article => this.article = article);
            // TODO: do something if there is an error, like the PMCID doesn't exist
        });
        
        // Set timestamp of article open
        this.datumEditService.setArticleOpenTime();

    }
    
    
    // Called when the user clicks a button to select a datum
    selectDatum(datum: any): void {
        // Cast the argument to Datum, we're being a little fast-and-loose with types here.
        this.selectedDatum = datum as Datum;
        
        // Notify the datum edit service (and article-text component) that the user has selected a datum.
        this.datumEditService.selectDatum(this.selectedDatum);
    }
    
    
    // val should be 'add' or 'remove'
    setHighlightMode(mode: string): void {
        this.highlightMode = mode;
        
        // Notify the datum edit service (and article-text component) that the user has selected a highlight mode
        this.datumEditService.setHighlightMode(this.highlightMode);
    }
    
    
    
    goBack(): void{
        if(!this.datumEditService.anyChanges() || confirm('Exit without saving your changes?')) {
            this.location.back();
        }
    }
    
    
    submit(): void{
        this.datumEditService.submitEdits(this.article, () => this.location.back());
    }
}
