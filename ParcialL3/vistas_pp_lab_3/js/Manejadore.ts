/// <reference path="Sobre.ts"/> 


namespace PrimerParcial {
    
    export class Manejadora{

        // ------------------------------PARTE 2-----------------------------
        // ------------------------------AGREGAR-----------------------------
        public static AgregarSobre(){
            
            const direccionDestinatario : string = (document.getElementById("direccion_destinatario") as HTMLInputElement).value;
            const remitente : string = (document.getElementById("remitente") as HTMLInputElement).value;
            const precioEstampilla : string = (document.getElementById("precio_estampilla") as HTMLInputElement).value;
            
            const URL : string = "http://localhost:2024/sobre";        
            
            //No se manda por bajo un "sobre _json" sino directo 
            let sobre = {
                "direccion_destinatario": direccionDestinatario,
                "remitente": remitente,
                "precio_estampilla": precioEstampilla
            }

            
            const opciones = {
                method: "POST",  
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },     
                body: JSON.stringify(sobre)
            }
            
            try {

                fetch(URL,opciones)
                .then((response: Response) => response.json())
                .then((response) => {

                    alert(response.mensaje);
                    console.log(response);
                });
            } catch (error) {
                console.log(error);
            }

        }
        
        // ------------------------------MOSTRAR------------------------

        public static MostrarSobres() {
            let tabla: HTMLTableElement = document.createElement("table"); //Creo tabla
            let div: HTMLDivElement = <HTMLDivElement>document.getElementById("divTabla"); // obtengo donde inyec

            const URL: string = "http://localhost:2024/sobre";
        
            const opciones = {
                method: "GET",
            };
        
            fetch(URL, opciones)
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    `;
        
                    let tbody = tabla.querySelector("tbody");
        
                    // Verificar si tbody no es null
                    if (tbody) {
                        // Iterar sobre los sobres y crear una fila para cada uno
                        response.sobres.forEach((obj: any) => {

                            let fila = document.createElement("tr");
                            fila.innerHTML = `
                                <td>${obj.id}</td>
                                <td>${obj.direccion_destinatario}</td>
                                <td>${obj.remitente}</td>
                                <td>${obj.precio_estampilla}</td>
                                <td>
                                    <input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.Eliminar(${JSON.stringify(obj)})'>
                                </td>
                                <td>    
                                    <input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.Modificar(${JSON.stringify(obj)})'>
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
            
        }


        // -------------------------------VERIFICAR--------------------------

        public static VerificarSobre(){
            let tabla: HTMLTableElement = document.createElement("table"); // Creo tabla
            let div : HTMLDivElement = <HTMLDivElement> document.getElementById("divTabla");// obtengo donde inyec
            
            const remitente : string = (document.getElementById("remitente") as HTMLInputElement).value;

            const URL : string = `http://localhost:2024/sobre/${remitente}`;


            const opciones = {
                method: "GET"
            }
            
            try {
                fetch(URL,opciones)
                .then((response:Response) => response.json())
                .then((response) => {

                    div.innerHTML = "";
                    tabla.innerHTML = `
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Dirección destinatario</th>
                            <th>Remitente</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody></tbody>`;

                    let tbody = tabla.querySelector("tbody");

                    if (response.exito == true && tbody) {

                            response.sobres.forEach((obj:any) => { 
    
                                let fila = document.createElement("tr");
                                fila.innerHTML = `
                                    <td>${obj.id}</td>
                                    <td>${obj.direccion_destinatario}</td>
                                    <td>${obj.remitente}</td>
                                    <td>${obj.precio_estampilla}</td>
                                `;
    
                                tbody.appendChild(fila);
    
                                // console.log(obj);
                            });

                            div.appendChild(tabla);
    
                            alert("Hay registros");
                            console.log("Hay registros");
                    }
                    else{
                        alert("No hay registros");
                        console.log("No hay registros");
                    }

                    
                })

            } catch (error) {
                console.log(error);
            }  
        }

        //-----------------------
        public static ModificarSobre(){

            const id : string = (document.getElementById("id") as HTMLInputElement).value;
            const direccionDestinatario : string = (document.getElementById("direccion_destinatario") as HTMLInputElement).value;
            const remitente : string = (document.getElementById("remitente") as HTMLInputElement).value;
            const precioEstampilla : string = (document.getElementById("precio_estampilla") as HTMLInputElement).value;  

            let url:string = `http://localhost:2024/sobre`;
            
            let sobre = {
                "id" : id,
                "direccion_destinatario": direccionDestinatario,
                "remitente": remitente,
                "precio_estampilla": precioEstampilla
            }


            let data = {
                "sobre_json": sobre
            }

            let opciones = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },

                body: JSON.stringify(data)
            };

            try {
                fetch(url,opciones)
                .then((response:Response) => response.json())
                .then((response) => {

                    if (response.exito == true) {
                        
                        this.MostrarSobres();
                    }
                    else{
                        console.log(response);
                        alert(response.mensaje);
                    }
                    
                })

            } catch (error) {
                console.log(error);
            }

        }
     
        

        //------------------------
        public static Eliminar(obj:any){

            let url = "http://localhost:2024/sobre";

            if (!confirm(`¿Está seguro que desea eliminar ${obj.direccion_destinatario} -  ${obj.remitente} ?`)) {
                return;
            }

            const sobre = {
                "id" : obj.id
            };

            let opciones = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(sobre)
            };


            try {
                fetch(url,opciones)
                .then((response:Response) => response.json())
                .then((response) => {
                    
                    alert(response.mensaje);
                    console.log(response);

                    this.MostrarSobres();
                })
            } catch (error) {
                console.log(error);
            }
        }

    }


}