// import { Sobre } from './Sobre';
/// <reference path="Sobre.ts" />

namespace Cruz{

    export class Postal extends Sobre{

        public imagen:string;


        constructor(direccion_destinatario:string,remitente:string,precio_estampilla:number,imagen:string) {
            super(direccion_destinatario,remitente,precio_estampilla)
            this.imagen = imagen;
        }

        public toJSON(): JSON {  

            let sobreString = `{ "Direccion_destinatario": ${this.direccion_destinatario},
                                     "Remitente": ${this.remitente}, 
                                     "Precio_estampilla": "${this.precio_estampilla}",
                                     "Imagen" : "${this.imagen}" `;

            return JSON.parse(sobreString);
       }
    }


}