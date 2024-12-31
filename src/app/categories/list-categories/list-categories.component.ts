import { Component, inject, ViewChild } from '@angular/core';
import { AlertController, ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { CategoriesI } from 'src/app/models/category.models';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonAvatar,
  IonPopover, IonList, IonReorderGroup, IonItem, IonIcon, IonModal, IonButton, IonFab,
  IonFabButton, IonSelectOption, IonMenuButton } from "@ionic/angular/standalone";
import { UpdateCategoryModalComponent } from '../update-category-modal/update-category-modal.component';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab,  IonIcon, IonItem, IonReorderGroup,
    IonList, IonPopover, IonAvatar, IonLabel, IonContent, IonButtons, IonTitle, IonToolbar,
    IonHeader,  CommonModule, FormsModule,  IonMenuButton ]
})
export class ListCategoriesComponent {

  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  isLoading = false
  isClosePopoverOpen = false

  userProfile?: string;
  user: any;
  presentingElement: any = null;
  categories: CategoriesI[] = [];
  isModalOpen = false;
  selectedCategory: CategoriesI | null = null;

  constructor(private categoriesService: CategoriesService,
    private alertCtrl: AlertController,
    private userService: UserService,
    private router: Router,
    private modalCtrl: ModalController) {
      this.loadCategories();

  }
  @ViewChild('popover') popover: any;
  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.presentingElement = document.querySelector('.ion-page');

    this.userProfile = this.userService.userProfileImage
    this.user = this.userService.user
    this.loadCategories();
  }

  // handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
  //   console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
  //   ev.detail.complete();
  // }
  presentClosePopover(e: Event) {
    this.popover.event = e;
    this.isClosePopoverOpen = true;
  }
  navigate(url: any) {
    this.router.navigate([url])
  }

  async closeSession() {
    try {
      this.isClosePopoverOpen = false
      this.isLoading = true
      await this.userService.logout()
      this.router.navigateByUrl('/auth', { replaceUrl: true });
    } catch (error) {

    } finally {
      this.isLoading = false
    }
  }
  async loadCategories() {
    this.categories = await this.categoriesService.getCategories();
    console.log('viendo: ', this.categories);

  }

  async openCreateCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { parentcategories: this.categories },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Nueva Categoría:', result.data);

        // Aquí puedes manejar la lógica para guardar la categoría
        const newCategoryChild: CategoriesI = {
                        id: 0,
                        name: result.data.name,
                        description: result.data.description,
                        parentcategory: result.data.parentcategory,
        };
          this.categoriesService.createCategory(newCategoryChild);

      }
    });
    this.loadCategories();
    await modal.present();
  }

  handleReorder(event: any) {
    const movedItem = this.categories.splice(event.detail.from, 1)[0];
    this.categories.splice(event.detail.to, 0, movedItem);
    event.detail.complete();
    localStorage.setItem('categories', JSON.stringify(this.categories));
    //event.detail.complete();
  }

  async openEditModalCategory(category: CategoriesI) {
    const modal = await this.modalCtrl.create({
      component: UpdateCategoryModalComponent,
      componentProps: {
        category: category,
        categories: this.categories,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const updatedCategory = result.data;
         // Actualizar la categoría en el listado
         const index = this.categories.findIndex((cat) => cat.id === updatedCategory.id);
         if (index !== -1) {
           this.categories[index] = updatedCategory;
         }
        this.loadCategories(); // Recargamos las categorías desde LocalStorage
      }
    });

    return await modal.present();
  }

  async delCategoy(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Categoria',
      subHeader: 'Esta segurdo de eliminar la Categoria',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.categoriesService.deleteCategory(id);
            this.loadCategories();
          },
        },
      ],
    });
    await alert.present();
  }
}
