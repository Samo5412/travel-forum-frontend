
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MessageComponent } from "./message/message.component";
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        CommonModule, 
        RouterOutlet, 
        MessageComponent, 
        NavbarComponent,
        RouterLink
    ]
})

export class AppComponent  {
    
}