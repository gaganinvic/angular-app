import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { UserPhotosService } from '../../shared/services/photos.service';
import { AuthService } from '../../shared/services/auth.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { typesModel, widthsModel, userModel, sortParams, sortsValueParams } from '../../shared/models/user';

export interface DialogData {
  photo: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  photos;
  receivedPhotos;
  showHeight: number;
  showWidth: number;
  searchForm: FormGroup;
  widths;
  typess;
  sorts;
  sortsValue;
  allUsers;
  allPhotos;

  constructor(private userService: UserService, private userPhotosService: UserPhotosService, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {
    //this.getPhotos();
    this.getAllUsers();
    this.getAllPhotos();
    this.typess = typesModel;
    this.widths = widthsModel;
    this.sorts = sortParams;
    this.sortsValue = sortsValueParams
    this.searchForm = new FormGroup({
      selectedUser: new FormControl(''),
      selectedWidth: new FormControl(this.widths[0]),
      selectedType: new FormControl(this.typess[0]),
      selectedSort: new FormControl(this.sorts[0]),
      selectedSortValue: new FormControl(this.sortsValue[0])
    });
  }

  async getAllPhotos() {
    try {
      this.authService.showLoader = true;
      this.allPhotos = await this.userPhotosService.getAllPhotos();
      this.receivedPhotos = Object.assign({}, this.allPhotos)
      console.log("New this.photos :", this.allPhotos)
      this.getPhotos(localStorage.getItem('USERNAME'), 'all', 'all', 'createdAt', 'asc');
    } catch (e) {
      this.authService.showLoader = false;
      console.error('Unable to get photos!\n', e);
      this.authService.snackBar("Unable to get photos", "error");
    }
  }

  async getAllUsers() {
    try {
      this.authService.showLoader = true;
      this.allUsers = await this.userService.getAllUsers();
      this.allUsers.unshift(userModel)
      let currentUser = this.allUsers.filter((user) => {return user.username == localStorage.getItem('USERNAME')})
      console.log("currentUser is :", currentUser)
      this.searchForm.patchValue({
        selectedUser: currentUser[0]
      });
      console.log("New this.users :", this.allUsers)
    } catch (e) {
      this.authService.showLoader = false;
      console.error('Unable to Get Users!\n', e);
      this.authService.snackBar("Unable to get users", "error");
    }
  }

  async getPhotos(username, status, dimensions, sort, sortValue) {
    console.log("username, status, dimensions, sort, sortValue : ", username, status, dimensions, sort, sortValue)
    this.authService.showLoader = true;
    try {
      if(username == 'All' && status == 'all'){
        this.photos = this.allPhotos;
        this.photos = this.dynamiceSortFunction(this.photos, sort, sortValue);
      } else if(username == 'All'){
        this.photos = this.allPhotos.filter((photo) => {return photo.status == status})
        this.photos = this.dynamiceSortFunction(this.photos, sort, sortValue);
      } else if(status == 'all') {
        this.photos = this.allPhotos.filter((photo) => {return photo.username == username})
        this.photos = this.dynamiceSortFunction(this.photos, sort, sortValue);
      } else {
        this.photos = this.allPhotos.filter((photo) => {return photo.username == username && photo.status == status})
        this.photos = this.dynamiceSortFunction(this.photos, sort, sortValue);
      }

      //this.photos = this.allPhotos.filter((photo) => {return photo.username == username})
      this.photos.forEach((photo) => {
        photo.image = 'data:' + photo.imageType + ';base64,' + this.arrayBufferToBase64(photo.imageData.data);
        if(dimensions != 'all'){
          photo.imageHeight = this.showHeight = dimensions;
          photo.imageWidth = this.showHeight = dimensions;
        } else{
          this.showHeight = null;
          this.showHeight = null;
        }
        console.log("final photo is:", photo);
      });
      this.authService.showLoader = false;
    } catch (e) {
        this.authService.showLoader = false;
        this.authService.snackBar("Unable to load photos", "error");
        console.error('Unable to get Photos!\n', e);
    }
  }

  dynamiceSortFunction(photosToSort, field, sortValue) {
    this.photos = this.photos.sort((a,b) => {
      console.log("a.sort : b.sort",a[field], b[field]); 
      let value = a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 1
      if(sortValue == 'desc'){
        return value * -1
      }
      return value
    });
    return this.photos;
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
  }

  openEditDialog(photo): void {
    if(photo.username != localStorage.getItem("USERNAME")){
      this.authService.snackBar("You cannot update photo of another user", "error");
      return;
    }
    const dialogRef = this.dialog.open(EditDialog, {
      width: '250px',
      data: {photo: photo}
    });
    dialogRef.afterClosed().subscribe(result => {
      photo = result;
      console.log("New edited photo : ",photo);
      this.update(photo);
    });
  }
  
  async update(photo) {
    console.log("Caption to be updated : ", photo);
    try {
      this.authService.showLoader = true;
      const updatedPhoto = await this.userPhotosService.updatePhotos(photo.photoId, {captions: photo.captions});
      let foundIndex = this.photos.findIndex(photo => photo.photoId == updatedPhoto.photoId);
      this.photos[foundIndex].captions = updatedPhoto.captions;
      let foundIndexAll = this.allPhotos.findIndex(photo => photo.photoId == updatedPhoto.photoId);
      this.allPhotos[foundIndexAll].captions = updatedPhoto.captions;
      console.log("New this.photos :", this.photos)
      this.authService.showLoader = false;
    } catch (e) {
      this.authService.showLoader = false;
      console.error('Unable to delete photo!\n', e);
    }
  }

  async delete(photoRemove) {
    console.log("Photo to be deleted : ", photoRemove);
    try {
      if(photoRemove.username != localStorage.getItem("USERNAME")){
        this.authService.snackBar("You cannot delete photo of another user", "error");
        return;
      }
      this.authService.showLoader = true;
      await this.userPhotosService.deletePhotos(photoRemove.photoId);
      this.photos = this.photos.filter((photo) => {return photoRemove.photoId != photo.photoId})
      this.allPhotos = this.allPhotos.filter((photo) => {return photoRemove.photoId != photo.photoId})
      console.log("New this.photos :", this.photos)
      this.authService.showLoader = false;
    } catch (e) {
      this.authService.showLoader = false;
      console.error('Unable to delete photo!\n', e);
    }
  }

  async search() {
    console.log("width selectecd : ", this.searchForm.value);
    this.getPhotos(this.searchForm.value.selectedUser.username, this.searchForm.value.selectedType.id, this.searchForm.value.selectedWidth.id, this.searchForm.value.selectedSort.id, this.searchForm.value.selectedSortValue.id)
  }
}


@Component({
  selector: 'app-homeDialog',
  templateUrl: 'homeDialog.html',
})

export class EditDialog {

  constructor(
    public dialogRef: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}
