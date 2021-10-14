import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  usuario: Usuario = {
    uid: '',
    nombre:'',
    email: '',
    password: ''
  };

  constructor(public firebaseauthservice: FirebaseauthService,
              public router: Router,
              public toastController: ToastController) { }

  ngOnInit() {
    this.firebaseauthservice.logout();
  }

  iniciarSesion(){
    const credenciales = {
      email: this.usuario.email,
      password: this.usuario.password
    };

    this.firebaseauthservice.login(credenciales.email,credenciales.password).then(res=>{
      console.log("ingreso con exito")
      
        this.router.navigate(['/set-reference']);      
    }).catch(e =>{
      this.presentToast('Usuario o contraseña incorrectos');
    });

  }
  crearCuenta(){
    this.router.navigate(['/registro']);
  }
  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
