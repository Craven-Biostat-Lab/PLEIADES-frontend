/*
This app module loads the root component and defines imports and
services that are available across the entire project.  

When you add a new component to this project, you have to add it to
*/

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';


import { ArticleService } from './article.service';
import { AppComponent }  from './app.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleDatumsComponent } from './article-datums.component';
import { ArticleTextComponent } from './article-text.component';


import { routing } from './app.routing';

@NgModule({
  imports: [ 
    BrowserModule,
    HttpModule, 
    routing,
  ],
  
  declarations: [ 
    AppComponent,
    ArticleListComponent,
    ArticleDatumsComponent,
    ArticleTextComponent,
  ],
  
  providers: [ ArticleService ],
  
  bootstrap: [ AppComponent ]
})
export class AppModule { }
