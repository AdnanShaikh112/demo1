import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { OverviewComponent } from './overview/overview.component';
import { ProjectsComponent } from './projects/projects.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ConnectionsComponent } from './connections/connections.component';
import {
  CardsModule,
  DropdownMenusModule,
  WidgetsModule,
} from '../../_metronic/partials';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    OverviewComponent,
    ProjectsComponent,
    CampaignsComponent,
    DocumentsComponent,
    ConnectionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProfileRoutingModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule,
    FlatpickrModule.forRoot()
  ],
})
export class ProfileModule {}
