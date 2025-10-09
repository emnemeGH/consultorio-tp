import { Component, inject } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private dialog = inject(MatDialog)
  public _authService = inject(AuthService)

  
  abrirLogin() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px'
    });
  }
  
}
