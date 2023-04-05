import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: any;
  currentUser: any;
  technology?: string;
  from?: number;
  to?: number;
  error: string = "";
  errorFinal: string = "";
  selectedCourse: any;
  title: string = "Learning Management System"
  closeResult?: string;
  form: any = {
    name: null,
    description: null,
    duration: null,
    technology: null,
    launchURL: null
  };
  modalOptions?:NgbModalOptions;
  constructor(private userService: UserService, private token: TokenStorageService, private modalService: NgbModal) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      centered: true
    }
   }

  ngOnInit(): void {
    this.errorFinal = "";
    this.error = "";
    this.currentUser = this.token.getUser();
    this.GetAll();
  }

  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDelete(content: any, course: any) {
    this.selectedCourse = course;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.errorFinal = "";
    this.error = "";
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  GetAll(){
    this.technology = "";
    this.errorFinal = "";
    this.error = "";
    this.userService.getAllCourses().subscribe(
      data => {
        this.courses = data;
      },
      err => {
        this.error = JSON.parse(err.error).message;
      }
    );
  }

  callTech(tech : string){
    this.errorFinal = "";
    this.error = "";
    this.userService.getCourseByTech(tech).subscribe(
      data => {
        this.courses = data;
      },
      err => {
        this.error = JSON.parse(err.error).message;
      }
    );
  }

  addCourse(){
    this.error = "";
    this.errorFinal = "";
    const { name,description, duration, technology, launchURL } = this.form;
    this.userService.addCourse(name, description, duration, technology, launchURL).subscribe(
      data => {
        this.courses.push(data);
        this.modalService.dismissAll();
      },
      err => {
        this.errorFinal = JSON.parse(err.error).message;
      }
    );
    
  }

  deleteCourse(){
    this.error = "";
    this.errorFinal = "";
    const { id } = this.selectedCourse;
    console.log(this.selectedCourse);
    this.userService.deleteCourse(id).subscribe(
      data => {
        this.modalService.dismissAll();
        this.GetAll();
      },
      err => {
        console.log(err.error.message);
        this.errorFinal = err.error.message ?  err.error.message : err.error ;
      }
    );
  }

  onSubmit(){
    this.errorFinal = "";
    this.error = "";
    console.log(this.form);
    this.addCourse();
  }

  callDuration(tech : string, from?: number, to?: number){
    this.userService.getCourseByDuration(tech, from, to).subscribe(
      data => {
        this.courses = data;
      },
      err => {
        this.error = JSON.parse(err.error).message;
      }
    );
  }

  onSearch(): void {
    this.errorFinal = "";
    this.error = "";
    var from = this.from;
    var to = this.to;
    this.technology = this.technology?.trim();
    if(!this.technology?.trim() && !this.from && !this.to){
      this.GetAll();
      this.error = "Enter fields and search"
      return;
    }
    if (from && !to) {
      to = 999999;
    }
    if (!from && to) {
      from = 1;
    }
    if (this.technology?.trim() && from && to) {
      if (from > to) {
        this.error = "Duration From cannot be grater than Duration To";
        return;
      }
      this.callDuration(this.technology, from, to);
      return;
    }
    if(this.technology?.trim() && !from && !to){
      this.callTech(this.technology);
      return;
    }
    if(!this.technology?.trim() && from && to){
      this.callDuration("%20", from, to);
      return;
    }

  }


}
