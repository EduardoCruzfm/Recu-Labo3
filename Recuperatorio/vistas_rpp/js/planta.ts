namespace Cruz {

    export class Planta {
        
        protected codigo: string;
        protected nombre: string;
        protected color_flor: string;
        protected precio: number;
        protected foto: string;

        constructor(codigo: string, nombre: string, color_flor: string, precio: number, foto: string) {
            this.codigo = codigo;
            this.nombre = nombre;
            this.color_flor = color_flor;
            this.precio = precio;
            this.foto = foto;
        }

        public toJSON(): string {
            return JSON.stringify({
                "codigo": this.codigo,
                "nombre": this.nombre,
                "color_flor": this.color_flor,
                "precio": this.precio,
                "foto": this.foto
            });
        }
    }
}
