/// <reference path="Postal.ts" />

namespace PrimerParcial {

    export class ManejadoraPostales{
        public static URL:string = "http://localhost:2024/postal";

        public static AgregarPostal(){
                const direccionDestinatario : string = (document.getElementById("direccion_destinatario") as HTMLInputElement).value;
                const remitente : string = (document.getElementById("remitente") as HTMLInputElement).value;
                const precioEstampilla : string = (document.getElementById("precio_estampilla") as HTMLInputElement).value;
                
                const imagen : any = (<HTMLInputElement>document.getElementById("imagen"));
                
                let obj_postal = {
                    "direccion_destinatario": direccionDestinatario,
                    "remitente": remitente,
                    "precio_estampilla": precioEstampilla
                }

                let form = new FormData();
                form.append("obj_postal",JSON.stringify(obj_postal));
                form.append("imagen",imagen.files[0]);
                
                const opciones = {
                    method: "POST",      
                    body: form
                }
                
                try {

                    fetch(this.URL,opciones)
                    .then((response: Response) => response.json())
                    .then((response) => {

                        
                        alert(response.mensaje);
                        console.log(response);
                        this.MostrarPostales();
                    });
                } catch (error) {
                    console.log(error);
                }



        }

        public static MostrarPostales(){
            let tabla: HTMLTableElement = document.createElement("table"); //Creo tabla
            let div: HTMLDivElement = <HTMLDivElement>document.getElementById("divTablaPostales");//Donde inyecto

            const opciones = {
                method: "GET",
            };
        
            fetch(this.URL, opciones)
                .then((response: Response) => response.json())
                .then((response) => {
                    // Limpiar el contenido del div
                    div.innerHTML = "";
                    
                    // Crear el encabezado de la tabla
                    tabla.innerHTML = `
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Dirección destinatario</th>
                                <th>Remitente</th>
                                <th>Precio</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    `;
        
                    let tbody = tabla.querySelector("tbody");
        
                    // Verificar si tbody no es null
                    if (tbody) {
                        // Iterar sobre los sobres y crear una fila para cada uno
                        response.postales.forEach((obj: any) => {

                            let fila = document.createElement("tr");
                            fila.innerHTML = `
                                <td>${obj.id}</td>
                                <td>${obj.direccion_destinatario}</td>
                                <td>${obj.remitente}</td>
                                <td>${obj.precio_estampilla}</td>
                                <td><img src="http://localhost:2024/${obj.imagen}" alt="Foto" width="50" height="50"></td>
                                <td>
                                    <input type='button' value='Eliminar' onclick='PrimerParcial.ManejadoraPostales.EliminarPostal(${JSON.stringify(obj)})'>
                                </td>
                                <td>    
                                    <input type='button' value='Modificar' onclick='PrimerParcial.ManejadoraPostales.Modificar(${JSON.stringify(obj)})'>
                                </td>

                            `;
                            tbody.appendChild(fila);
                        });
        
                        // Añadir la tabla al div
                        div.appendChild(tabla);
                    } else {
                        console.error("No se pudo encontrar el tbody en la tabla.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        }

        public static Modificar(obj:any){
            (document.getElementById("id") as HTMLInputElement).value = obj.id;
            (document.getElementById("direccion_destinatario") as HTMLInputElement).value = obj.direccion_destinatario;
            (document.getElementById("remitente") as HTMLInputElement).value = obj.remitente;
            (document.getElementById("precio_estampilla") as HTMLInputElement).value = obj.precio_estampilla;
            
            const imgPreview = document.getElementById("imgImagen") as HTMLImageElement;
            imgPreview.src = `http://localhost:2024/${obj.imagen}`;
        }
        
        // (<HTMLInputElement>document.getElementById("imagen"));
        
        public static ModificarPostal(){
                // let div: HTMLDivElement = <HTMLDivElement>document.getElementById("divTablaPostales");
                const id : string = (document.getElementById("id") as HTMLInputElement).value;
                const direccionDestinatario : string = (document.getElementById("direccion_destinatario") as HTMLInputElement).value;
                const remitente : string = (document.getElementById("remitente") as HTMLInputElement).value;
                const precioEstampilla : string = (document.getElementById("precio_estampilla") as HTMLInputElement).value;
                
                const imagen : any = (<HTMLInputElement>document.getElementById("imagen"));
                
                let postal_json = {
                    // "id": id,
                    "direccion_destinatario": direccionDestinatario,
                    "remitente": remitente,
                    "precio_estampilla": precioEstampilla
                }

                let form = new FormData();
                form.append("postal_json",JSON.stringify(postal_json));
                form.append("imagen",imagen.files[0]);
                
                const opciones = {
                    method: "PUT",      
                    body: form
                }
                
                try {

                    fetch(this.URL + `/${id}`,opciones)                     // parametro por RUTA  id
                    .then((response: Response) => response.json())
                    .then((response) => {
                        
                        if (response.exito) {
                            
                            this.MostrarPostales();
                        }else{

                            alert(response.mensaje);
                            console.log(response);
                        }

                    });
                } catch (error) {
                    console.log(error);
                }
        }

        public static EliminarPostal(obj:any){
            if (!confirm(`¿Está seguro que desea eliminar ${obj.direccion_destinatario} -  ${obj.remitente} ?`)) {
                return;
            }

            const postal = {
                "id" : obj.id
            };

            let opciones = {
                method: "DELETE",
                // headers: {
                //     "Content-Type": "application/json;charset=UTF-8"
                // },

                // body: JSON.stringify(postal)
            };


            try {
                fetch(this.URL + `/${obj.id}`,opciones)         // Eliminar mandado id por params
                .then((response:Response) => response.json())
                .then((response) => {
                    
                    alert(response.mensaje);
                    console.log(response);
                    this.MostrarPostales();
                })
            } catch (error) {
                console.log(error);
            }
        }

    }

     // Agregar el event listener al final del archivo 
     document.addEventListener('DOMContentLoaded', () => {
        PrimerParcial.ManejadoraPostales.MostrarPostales();
    });
}
