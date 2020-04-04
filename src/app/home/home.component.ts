import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
  showHeight: number = 300;
  showWidth: number = 300;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getPhotos();
  }

  async getPhotos() {
    try {
      this.photos = await this.userService.getPhotos();
      this.receivedPhotos = Object.assign({}, this.photos)
      console.log("this.photos:: ", this.photos);
      this.photos.forEach((photo) => {
        
        photo.image = 'data:' + photo.imageType + ';base64,' + this.arrayBufferToBase64(photo.imageData.data);
        if(this.showHeight && this.showWidth ){
          photo.imageHeight = this.showHeight
          photo.imageWidth = this.showWidth
        }
        console.log("final photo is:", photo);
      });
    } catch (e) {
        console.error('Unable to get Photos!\n', e);
    }
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
      const updatedPhoto = await this.userService.updatePhotos(photo.photoId, {captions: photo.captions});
      let foundIndex = this.photos.findIndex(photo => photo.photoId == updatedPhoto.photoId);
      this.photos[foundIndex].captions = updatedPhoto.captions;
      console.log("New this.photos :", this.photos)
    } catch (e) {
      console.error('Unable to delete photo!\n', e);
    }
  }

  async delete(photoRemove) {
    console.log("Photo to be deleted : ", photoRemove);
    try {
      await this.userService.deletePhotos(photoRemove.photoId);
      this.photos = this.photos.filter((photo) => {return photoRemove.photoId != photo.photoId})
      console.log("New this.photos :", this.photos)
    } catch (e) {
      console.error('Unable to delete photo!\n', e);
    }
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
