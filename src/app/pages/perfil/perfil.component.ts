import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario: Usuario = {
    uid: '',
    nombre:'',
    email: '',
    password: ''
  };
  constructor( public firebaseauthservice: FirebaseauthService,
              public router: Router) { }

  ngOnInit() {}

  async registrarse(){
    const credenciales = {
      email: this.usuario.email,
      password: this.usuario.password
    };
    const res = await this.firebaseauthservice.registrar(credenciales.email, credenciales.password);
    if(res){
      this.router.navigate(['/set-reference'])
    }

  }
  
  Volver(){
    this.router.navigate(['/'])
  }

}
