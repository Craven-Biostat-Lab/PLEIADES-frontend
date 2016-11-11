/*
This component shows the front-page of the app, displaying a list
of articles that the user can edit.

Articles are retrieved from the back-end using the articles service.
*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
    moduleId: module.id,
    selector: 'article-list',
    templateUrl: 'article-list.component.html',
    styleUrls: ['article-list.component.css'],
})

export class ArticleListComponent implements OnInit {
    
    // The list of articles to display
    articles: Article[];

    // The currently-shown page of results.
    page: number;

    // The number of articles to show on each page.
    private articlesPerPage = 10;


    constructor(
        private articleService: ArticleService, 
        private router: Router, 
        private route: ActivatedRoute,
    ) {}


    // Fetch articles from the back-end.
    getArticles(page: number): void {

        let limit: number = this.articlesPerPage;
        let skip: number = page * this.articlesPerPage;

        this.articleService.getArticles(limit, skip).then(articles => this.articles = articles);
    }
    
    
    // Load articles when the component is loaded.
    ngOnInit(): void {

        
        this.route.params.forEach((params: Params) => {
            this.page = +params['page'];
            this.getArticles(this.page);
        });

        console.log(this.articles);
        
    }
    

    gotoNextPage(): void {
        this.router.navigate(['/articlelist', (this.page+1).toString()]);
    }

    gotoPrevPage(): void {
        this.router.navigate(['/articlelist', (this.page-1).toString()]);
    }

    
    // When the user clicks on an article, set the URL to the page to edit
    // the article's datums.
    gotoArticle(article: Article) {
        this.router.navigate(['/article-datums', article.PMCID]);
    }
    
    
    // Format the last-edited timestamp shown for each article in the template.
    formatTimestamp(timestamp: number): string {
        let date = new Date(timestamp);
        return date.toLocaleString();
    }
}
