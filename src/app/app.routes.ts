import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { MyDestinationsComponent } from './my-destinations/my-destinations.component';
import { AddPostComponent } from './add-post/add-post.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from './services/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


/**
 * Defines the routing configuration for the application.
 */
export const routes: Routes = [
    {title: 'Authentication', path:'login', component: AuthenticationComponent},
    {title: 'Destinations', path:'destinations', component: DestinationsComponent},
    {title: 'My Destinations', path:'my-destinations', component: MyDestinationsComponent,  canActivate: [AuthGuard]},
    {title: 'Add a new post', path:'add-post', component: AddPostComponent,  canActivate: [AuthGuard]},
    {title: 'Destination', path: 'posts/:id', component: PostComponent},
    {path: '', redirectTo: 'destinations', pathMatch: 'full'},
    {path: 'unauthorized', component: UnauthorizedComponent },
    {path: '**', redirectTo: '/unauthorized'}
];
