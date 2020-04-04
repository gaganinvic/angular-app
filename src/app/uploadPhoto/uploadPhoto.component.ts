import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './uploadPhoto.component.html',
  styleUrls: ['./uploadPhoto.component.scss']
})
export class UploadPhotoComponent implements OnInit {
  returnUrl: string;
  uploadForm: FormGroup;
  fileToUpload: File = null;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  status: string;
  errorMessage: string;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.errorMessage = '';
    this.uploadForm = new FormGroup({
      caption: new FormControl('', [Validators.required])
    });
  }

  uploadFile(event){
    console.log("event : ", event)
    this.fileToUpload = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    reader.onload = (event1: any) => {
      let img = new Image();   
      img.src = event1.target.result;
      img.onload = (event2) => {
        console.log("height :: ", img.height)
        console.log("width :: ", img.width)
        this.imageWidth = img.width;
        this.imageHeight = img.height;
      }
      
      this.imageUrl = event1.target.result;
    };

    reader.readAsDataURL(this.fileToUpload);
  }

  async submit(status) {
    console.log("this.fileToUpload :::", this.fileToUpload)
    try {
      const formData: any = new FormData();
      formData.append("captions", this.uploadForm.value.caption);
      formData.append("photo", this.fileToUpload);
      formData.append("imageHeight", this.imageHeight);
      formData.append("imageWidth", this.imageWidth);
      formData.append("status", status);
      const response = await this.userService.uploadPhotos(formData)
      console.log("response:: ", response);
      this.fileToUpload = null;
      this.router.navigate(['/home'])
    } catch (e) {
        this.errorMessage = 'Upload file failed. Please try again!';
        console.error('Upload file failed. Please try again!\n', e);
    }
  }

}
