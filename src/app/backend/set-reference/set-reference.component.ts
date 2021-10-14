import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Referencia } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-reference',
  templateUrl: './set-reference.component.html',
  styleUrls: ['./set-reference.component.scss'],
})
export class SetReferenceComponent implements OnInit {

  referencias : Referencia[]=[];

  newReference : Referencia;

  enableNewReference = false;
  enableDetails = false;
  private path = 'Referencias/';
  loading: any;
  uid;
  constructor(public firestoreservice: FirestoreService, 
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firebaseauthservice : FirebaseauthService,
              public router: Router) { 


               
            


                 

              }

  async ngOnInit() {

    
     
      
      console.log(this.firebaseauthservice.getUid());
      //this.path = 'Referencias/'+this.uid+'/';
    this.uid = await this.firebaseauthservice.getUid();
    this.path = 'Referencias/'+this.uid+'/references/';
    if(this.uid==null){
      this.router.navigate(['/']);
    }
      
    console.log("este es el path", this.path)
    console.log("este es el uid",this.uid);
    this.getReferencia();

  }

  loadReferencias(){
    const path = this.path + '/' + this.uid + '/references/';
    this.firestoreservice.getDoc<Referencia[]>(path, this.uid).subscribe(res=>{

              console.log(res)
              if(res){
                this.referencias=res;
              }
    });

  }

  initReferencias(){
      this.referencias = [];
  }

  guardarReferencia(){
 
    if(this.newReference.titulopub==""||this.newReference.autores==""||this.newReference.tipopub==null||this.newReference.anyopub==null){
      this.presentToast('los campos con * son obligatorios');
    }else{
      this.enableNewReference = false;
      this.presentLoading();
    this.firestoreservice.createDoc(this.newReference, this.path, this.newReference.id).then( res=>{
      this.loading.dismiss();
      this.presentToast('Guardado con éxito');
    });
    }
    
    
  }

  getReferencia(){
    
    this.firestoreservice.getCollection<Referencia>(this.path).subscribe( res =>{
        this.referencias = res;
    });
  }
  async deleteReferencia(referencia: Referencia){

   
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Advertencia',
        message: 'Seguro que desea <strong>eliminarla</strong>!!!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
              this.firestoreservice.deleteDoc(this.path, referencia.id).then( res=>{
                this.loading.dismiss();
                this.presentToast('Eliminado con éxito');
                this.alertController.dismiss();
              });
            


            }
          }
        ]
      });
  
      await alert.present();
    }


 

  nueva(){
    this.enableNewReference = true;
    this.newReference ={
      titulopub: '',
      autores: '',
      tipopub: null,
      eventorevista: '',
      doi: '',
      anyopub: null,
      id : this.firestoreservice.getId()
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Guardando...',
      duration: 2000
    });
    await this.loading.present();

  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async seeDetails(referencia:Referencia){
    let texttipopub = '';
    switch (referencia.tipopub.toString()) {
      case "1":
        texttipopub = '1. Artículo de revista'
        break;
    
      case "2":
        texttipopub = '2. Artículo en evento'
        break;
    
      case "3":
          texttipopub = '3.otro'
          break;

      default:
        console.log("default");
    }

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Detalles',
      subHeader: referencia.titulopub,
      message: 'Autores: '+referencia.autores+'<br/>'+
      'Tipo: '+texttipopub+'<br/>'+
      'Evento o Revista: '+referencia.eventorevista+'<br/>'+
      'DOI: '+referencia.doi+'<br/>'+
      'Año: '+referencia.anyopub+'<br/>',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();


  }

  async cerrarSesion(){
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Advertencia',
      message: 'Seguro que desea <strong>cerrar sesión</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.router.navigate(['/']);
            this.firebaseauthservice.logout();
        
          


          }
        }
      ]
    });

    await alert.present();

  }

 

}
