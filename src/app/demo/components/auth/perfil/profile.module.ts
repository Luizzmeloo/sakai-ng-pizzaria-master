import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { EditProfileComponent } from './edit-profile.component';

@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    FormsModule, // Add this to enable [(ngModel)]
    RouterModule.forChild([{ path: '', component: EditProfileComponent }]),
  ],
})
export class ProfileModule {}
