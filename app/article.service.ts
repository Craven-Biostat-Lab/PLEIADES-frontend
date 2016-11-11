/*
This file handles communication with the back-end to retrieve a list
of articles, and retrieve info+datums for a single article.
*/


import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Article } from './article';



@Injectable()
export class ArticleService {

    // URL to the resource on the back-end that responds with a list of articles
    private articleUrl = '/api/v01/articles';

    constructor(private http: Http) {}


    // Return a list of articles from the back-end
    getArticles(limit: number, skip: number): Promise<any> {

        let params = new URLSearchParams();
        params.set('limit', limit.toString());
        params.set('skip', skip.toString());

        return this.http.get(this.articleUrl, {search:params})
            .toPromise()
            .then(
                response => {
                    return {                    
                        articles: response.json().articles as Article[],
                        articleCount: response.json().articleCount
                    };
                }
            )
            .catch(this.handleError);
    }
    
    
    // Return a single article, including datums
    getArticle(PMCID: string): Promise<Article> {
        return this.http.get(this.articleUrl + '/' + PMCID)
            .toPromise()
            .then(response => response.json().article as Article)
            .catch(this.handleError);
    }
    
        
    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
    }

}
