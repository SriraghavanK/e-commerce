import { Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductComponent } from './product/product.component';
import { AuthGuard } from "./guards/auth.guard"
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
export const routes: Routes = [
    {path: '',component: LoginpageComponent},
    {path: 'login',component: LoginpageComponent},
    {path:'home',component:HomeComponent},
    {path:'about' ,component:AboutComponent},
    {path:'contact', component:ContactComponent},
    {path: 'cart' , component:CartComponent},
    {path:'profile', component:ProfileComponent},
    {path:'products',component:ProductComponent},
    {path:'checkout',component:CheckoutComponent},
    {path:'orders' , component:OrdersComponent},
    {path: '**', redirectTo: '/login', pathMatch: 'full'}
];
