namespace Cruz{

    export class Sobre{

        // Sobre, posee como atributos protegidos:
        // ● direccion_destinatario (cadena)
        // ● remitente (cadena)
        // ● precio_estampilla (numérico)

        protected direccion_destinatario:string;
        protected remitente:string;
        protected precio_estampilla:number;

        public constructor(direccion_destinatario:string,remitente:string,precio_estampilla:number){
            this.direccion_destinatario = direccion_destinatario;
            this.remitente = remitente;
            this.precio_estampilla = precio_estampilla;
        }

        

        //Un constructor (que inicialice los atributos), un método de instancia toJSON(), que retornará los
        // datos de la instancia (en una cadena con formato JSON).

        public toJSON(): JSON {  

            let sobreString = `{ "Direccion_destinatario": ${this.direccion_destinatario},
                                     "Remitente": ${this.remitente}, 
                                     "Precio_estampilla": "${this.precio_estampilla}" }`;

            return JSON.parse(sobreString);
       }

    }
}
