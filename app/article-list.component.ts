/*
This component shows the front-page of the app, displaying a list
of articles that the user can edit.

Articles are retrieved from the back-end using the articles service.
*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

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


    constructor(private articleService: ArticleService, private router: Router) {}

    // Fetch articles from the back-end.
    getArticles(): void {
        this.articleService.getArticles().then(articles => this.articles = articles);
    }
    
    
    // Load articles when the component is loaded.
    ngOnInit(): void {
        this.getArticles();
        console.log(this.articles);
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
