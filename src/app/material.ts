import { NgModule } from "@angular/core";
import { MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatMenuModule, MatProgressBarModule, MatListModule,
    MatToolbarModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatGridListModule, MatRippleModule, MatSlideToggleModule } from "@angular/material";

@NgModule({
    imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatMenuModule, MatProgressBarModule, MatListModule,
        MatToolbarModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatGridListModule, MatRippleModule, MatSlideToggleModule],
    exports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatMenuModule, MatProgressBarModule, MatListModule,
        MatToolbarModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatGridListModule, MatRippleModule, MatSlideToggleModule]
})
export class MaterialModule { }