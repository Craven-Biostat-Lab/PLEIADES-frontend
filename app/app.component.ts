/*
This is the root component of the app, it doesn't do much except
for include the router outlet.
*/


import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent { }
