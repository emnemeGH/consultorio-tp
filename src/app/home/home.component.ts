import { Component, inject } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private dialog = inject(MatDialog)

  abrirLogin() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px'
    });
  }
}
