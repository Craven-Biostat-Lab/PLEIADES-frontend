/*
This file defines routes for the application, each URL route is
mapped to a component.
*/

import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleListComponent } from './article-list.component';
import { ArticleDatumsComponent } from './article-datums.component';

const appRoutes: Routes = [
  {
    path: 'articlelist/:page',
    component: ArticleListComponent
  },
  {
    path: 'articlelist',
    redirectTo: '/articlelist/0',
  },
  {
    path: '',
    redirectTo: '/articlelist/0',
    pathMatch: 'full'
  },
  {
    path: 'article-datums/:PMCID',
    component: ArticleDatumsComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
