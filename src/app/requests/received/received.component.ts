import { Component, OnInit } from '@angular/core';
import { UsersI } from 'src/app/models/users.models';
import { UsersService } from 'src/app/services/user/users.service';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonList,
  IonItem, IonAvatar,  IonMenuButton, IonImg } from "@ionic/angular/standalone";
import { RequestI } from 'src/app/models/requests.models';
import { GroupsI } from 'src/app/models/groups.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss'],
  standalone: true,
  imports: [IonImg, IonAvatar, IonItem, IonList,IonLabel, IonContent, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonMenuButton, CommonModule ]
})
export class ReceivedComponent implements OnInit {
  users: UsersI[] = [];
  groups: GroupsI[] = [];
  requests: RequestI[] = [];
  filteredRequests: RequestI[] = [];
  iLogo: string = 'assets/logo.png';
  selectedUser: UsersI | null = null;
  selectedGroup: GroupsI | null = null;
  constructor(private usersListService: UsersService) {
    this.loadUsers();
  }

  get objectKeys() {
    return Object.keys;
  }

  ngOnInit() {
    const storeRequests = localStorage.getItem('requests');
    if (storeRequests) {
      this.requests = JSON.parse(storeRequests);
    }
    console.log('solicitudes: ', this.requests);
    console.log('solicitudes: ', this.requests.forEach(req => {
      console.log('ID', req.group_destine);

    }));

    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      this.groups = JSON.parse(storedGroups);
    }

    const storeUser = localStorage.getItem('users');
    if (storeUser) {
      this.selectedUser = JSON.parse(storeUser);
    }
    this.selectedUser.group_id = 1;

    if (!this.selectedUser || !this.selectedUser.group_id) {
      console.error('Error: Usuario no válido o sin group_id.');
      return;
    }
    console.log('Loaded Solicitudes Recibidas ahora:', this.requests);
     //this.filteredRequests = this.filterRequests(this.selectedUser, this.groups, this.typeRequests);
     //this.filteredRequestsMax = this.requests.filter(req => req.group_destine === this.filterRequests(this.selectedUser, this.groups, this.typeRequests) );
     //this.filteredRequestsMax = this.requests.filter(req => req.group_destine === this.filterRequests(this.selectedUser, this.groups, this.typeRequests ));
     //this.filteredRequestsMax = this.requests.filter(req => this.validateGroups(req.group_destine, this.selectedUser.group_id));
     this.filteredRequests = this.getRequestsForDestineGroup(this.selectedUser.group_id);
     console.log('Loaded ahora:', this.filteredRequests);
     console.log('Loaded Solicitudes Recibidas ahora:', this.selectedUser);

  }
  isImage(url: string): boolean {

    if (typeof url !== 'string') {
      return false;
    }
    return /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url);
  }

  async isValidImageUrlAsync(url: string): Promise<boolean> {
    if (!url) {
      return false;
    }

    // Verifica que sea una URL válida
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/i;
    if (!urlPattern.test(url)) {
      return false;
    }

    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      return response.ok && contentType?.startsWith('image/');
    } catch (error) {
      console.error('Error validating image URL:', error);
      return false;
    }
  }


  getRequestsForDestineGroup(userGroupId: number): RequestI[] {
    console.log(userGroupId);

    const userHierarchy = this.getAllParetsGroups(userGroupId, this.groups);
    return this.requests.filter(request => {

      if (request.group_destine && request.group_destine.id !== undefined) {
        return userHierarchy.includes(request.group_destine.id);
      }
      return false;
    }
    );
  }

  getAllParetsGroups(groupId: number, groups: GroupsI[]): number[] {
    const hierarchy: number[] = [];
    console.log(groupId);

    let currentGroup = groups.find(g => g.id === groupId);

    while (currentGroup) {
      console.log(currentGroup.id);
      hierarchy.push(currentGroup.id);
      currentGroup = groups.find(g => g.id === currentGroup.parentId);
    }
    return hierarchy;
  }
  async loadUsers() {
    this.users = await this.usersListService.getUsers();
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
