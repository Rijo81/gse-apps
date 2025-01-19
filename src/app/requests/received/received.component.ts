import { Component, OnInit } from '@angular/core';
import { UsersI } from 'src/app/models/users.models';
import { UsersService } from 'src/app/services/user/users.service';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonList, IonReorderGroup,
  IonItem, IonAvatar, IonIcon, IonFab, IonFabButton, IonMenuButton, IonImg } from "@ionic/angular/standalone";
import { TypeRequestsI } from 'src/app/models/requests.models';
import { GroupsI } from 'src/app/models/groups.models';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss'],
  standalone: true,
  imports: [IonImg, IonAvatar, IonItem, IonList,IonLabel, IonContent, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonMenuButton ]
})
export class ReceivedComponent implements OnInit {

  users: UsersI[] = [];
  groups: GroupsI[] = [];

  iLogo: string = 'assets/logo.png';
  typeRequests: TypeRequestsI[] = [];
  selectedTypeId: number | null = null;
  selectedType: TypeRequestsI | null = null;
  selectedUser: UsersI | null = null;
  selectedGroup: GroupsI | null = null;
  requests: any[] = [];
  filteredRequestsMax: any[] = [];
  filteredRequests: { groupOrigin: TypeRequestsI[]; groupDestine: TypeRequestsI[] } | undefined;
  constructor(private usersListService: UsersService) {
    this.loadUsers();
  }

  ngOnInit() {
    const storeRequests = localStorage.getItem('requests');
    if (storeRequests) {
      this.requests = JSON.parse(storeRequests);
    }
    const storeUser = localStorage.getItem('users');
    if (storeUser) {
      this.selectedUser = JSON.parse(storeUser);
    }
     //this.filteredRequests = this.filterRequests(this.selectedUser, this.groups, this.typeRequests);
     this.filteredRequestsMax = this.requests.filter(req => req.group_destine === this.filterRequests(this.selectedUser, this.groups, this.typeRequests));
     console.log('Loaded Solicitudes  ahora:', this.filteredRequests);
     console.log('Loaded Solicitudes Recibidas ahora:', this.requests);
     console.log('Loaded Solicitudes Recibidas ahora:', this.selectedUser);
  }

  getAllParetsGroups(groupId: number, groups: GroupsI[]): number[] {
    const hierarchy: number[] = [];
    let currentGroup = groups.find(g => g.id === groupId);

    while (currentGroup) {
      hierarchy.push(currentGroup.id);
      currentGroup = groups.find(g => g.id === currentGroup.parentId);
    }

    return hierarchy;
  }

  filterRequests(user: UsersI, groups: GroupsI[], typeRequests: TypeRequestsI[]) {
    const userGroupHierarchy = this.getAllParetsGroups(user.group_id, groups);

    const groupOrigin = typeRequests.filter(t =>
      userGroupHierarchy.includes(t.group_origin.id)
    );

    const groupDestine = typeRequests.filter(t =>
      userGroupHierarchy.includes(t.group_destine.id)
    );

    return { groupOrigin, groupDestine };
  }

  async loadUsers() {
    this.users = await this.usersListService.getUsers();
    //console.log(this.users);

  }
  trackByIndex(index: number, item: any): number {
    return index;
  }

	// const storeUsers = localStorage.getItem('users');
    // if (storeUsers) {
    //   this.users = JSON.parse(storeUsers);
    // }
    // const storeGroups = localStorage.getItem('groups');
    // if (storeGroups) {
    //   this.groups = JSON.parse(storeGroups);
    // }
    // this.filteredRequests = this.requests.filter(req => req.typeName === 'Mano de Obra');
    // console.log('Loaded Solicitudes Recibidas:', this.requests);
}
