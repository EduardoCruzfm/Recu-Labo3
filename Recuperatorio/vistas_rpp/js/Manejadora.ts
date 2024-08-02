/// <reference path="planta.ts" />

namespace RecPrimerParcial {

    export class Manejadora {

        public static AgregarPlantaFotoBD(): void {
            const codigo = (document.getElementById("codigo") as HTMLInputElement).value;
            const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
            const color_flor = (document.getElementById("color_flor") as HTMLInputElement).value;
            const precio = parseFloat((document.getElementById("precio") as HTMLInputElement).value);
            const foto : any = (<HTMLInputElement>document.getElementById("foto"));
        
            // const obj_planta = {
            //     "codigo": codigo,
            //     "nombre": nombre,
            //     "color_flor": color_flor,
            //     "precio": precio
            // };

            //Cuando recibe Foto y param sueltos no dentro de un 'planta_Json'

            /*
                let file = request.file;
                
                let obj = request.body;   SUELTO
            */

            let form = new FormData();
            form.append("codigo", codigo);
            form.append("nombre", nombre);
            form.append("color_flor", color_flor);
            form.append("precio", precio.toString());
            form.append("foto", foto.files[0]);

        
            // let form = new FormData();
            // form.append("obj_planta", JSON.stringify(obj_planta));
            // form.append("foto", foto.files[0]);
        
            const URL = "http://localhost:2024/agregarPlantaFotoBD";
        
            const opciones = {
                method: "POST",
                body: form
            };

            console.log(form);
        
            fetch(URL, opciones)
                .then(response => response.json())
                .then(data => {
                    console.log(data.mensaje);
                    alert(data.mensaje);
        
                    if (data.exito) {
                        Manejadora.MostrarPlantasFotosBD(); 
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Error al agregar la planta.");
                });
        }
        

      
        public static MostrarPlantasFotosBD(): void {
            const div: HTMLDivElement = document.getElementById("divTablaPlantaFotos") as HTMLDivElement; //Donde inyecto
        
            const URL: string = "http://localhost:2024/listarPlantasFotosBD";
            
            const opciones = {
                method: "GET",
            };
        
            fetch(URL, opciones)
                .then((response: Response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la respuesta: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((response) => {
                    div.innerHTML = "";
        
                    const tabla: HTMLTableElement = document.createElement("table");//Creo tabla
        
                    tabla.innerHTML = `
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Color de la Flor</th>
                                <th>Precio</th>
                                <th>Foto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    `;
        
                    const tbody: HTMLTableSectionElement | null = tabla.querySelector("tbody");
        
                    if (tbody) {
                        response.forEach((obj: any) => {                     //response directo por que no retorna ningun obj
                            const fila: HTMLTableRowElement = document.createElement("tr");
                            
                            const rutaCompleta = obj.foto;
                            const nombreArchivo = rutaCompleta.substring(rutaCompleta.lastIndexOf('/') + 1);

                            //localhost src="../rpp_nodejs_api - 2024 - alumnos/public/plantas/fotos/${nombreArchivo}"
                            
                            fila.innerHTML = `
                                <td>${obj.codigo}</td>
                                <td>${obj.nombre}</td>
                                <td><input type="color" value="${obj.color_flor}" disabled /></td>
                                <td>${obj.precio}</td>
                                <td><img src="http://localhost:2024/plantas/fotos/${nombreArchivo}" alt="Imagen de la planta" style="width: 50px; height: 50px;"></td>
                                <td>
                                    <input type='button' value='Eliminar' onclick='RecPrimerParcial.Manejadora.EliminarPlantaFotoBD(${JSON.stringify(obj)})'>
                                    <input type='button' value='Modificar' onclick='RecPrimerParcial.Manejadora.Modificar(${JSON.stringify(obj)})'>
                                </td>
                            `;
                            tbody.appendChild(fila);
                        });
        
                        div.appendChild(tabla);
                    } else {
                        console.error("No se pudo encontrar el tbody en la tabla.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error al mostrar las plantas.");
                });
        }
        
        
        

        public static Modificar(planta: any): void {
            (document.getElementById("codigo") as HTMLInputElement).value = planta.codigo;
            (document.getElementById("nombre") as HTMLInputElement).value = planta.nombre;
            (document.getElementById("color_flor") as HTMLInputElement).value = planta.color_flor;
            (document.getElementById("precio") as HTMLInputElement).value = planta.precio;
        
            const imgPreview = document.getElementById("imgFoto") as HTMLImageElement;
            imgPreview.src = `http://localhost:2024/${planta.foto}`;
        }
        

        
       

        public static ModificarPlanta(): void {

            const codigo = (document.getElementById("codigo") as HTMLInputElement).value;
            const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
            const colorFlor = (document.getElementById("color_flor") as HTMLInputElement).value;
            const precio = parseFloat((document.getElementById("precio") as HTMLInputElement).value);
            const foto :any = (<HTMLInputElement>document.getElementById("foto"));
        
            const planta_json = {
                "codigo": codigo,
                "nombre": nombre,
                "color_flor": colorFlor,
                "precio": precio
            };
        
            // Pide un json y imagen aparte
            /*
                let file = request.file;

                let obj = JSON.parse(request.body.planta_json);
            */

            let form = new FormData();
            form.append("planta_json", JSON.stringify(planta_json));
            form.append("foto", foto.files[0]);
        
            
            const URL = `http://localhost:2024/modificarPlantaFotoBD`;
        
            const opciones = {
                method: "PUT",
                body: form
            };
        
            
            fetch(URL, opciones)
                .then(response => response.json())
                .then(data => {
                    console.log(data.mensaje);
                    alert(data.mensaje);
        
                    if (data.exito) {
                        RecPrimerParcial.Manejadora.MostrarPlantasFotosBD();
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Error al modificar la planta.");
                });
        }
        

        
        
        public static EliminarPlantaFotoBD(planta: any): void {

            if (confirm(`¿Está seguro que desea eliminar la planta con código ${planta.codigo} y nombre ${planta.nombre}?`)) {

                const URL = `http://localhost:2024/eliminarPlantaFotoBD`;


                /*
                
                    let obj = request.body;
                                                                            -----------
                    conn.query("select foto from plantas where codigo = ?", [obj.codigo], (err:any, result:any)=>{
                
                */ 


        
                const obj = {
                    "codigo": planta.codigo
                };
        
                let opciones = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    body: JSON.stringify(obj)
                };
        
                fetch(URL, opciones)
                    .then(response => response.json())
                    .then(response => {

                        alert(response.mensaje);
                        console.log(response);
        
                        if (response.exito) {
                            RecPrimerParcial.Manejadora.MostrarPlantasFotosBD(); // Actualizar la lista de plantas después de eliminar
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("Error al eliminar la planta.");
                    });
            }
        }



       public static FiltrarPlantasFotoBD(): void {
            const codigo = (document.getElementById("codigo") as HTMLInputElement).value;
            const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
            const colorFlor = (document.getElementById("color_flor") as HTMLInputElement).value;
            const precio = (document.getElementById("precio") as HTMLInputElement).value;

            const planta = {
                codigo: codigo || undefined,
                nombre: nombre || undefined,
                color_flor: colorFlor || undefined,
                precio: precio ? parseFloat(precio) : undefined,
            };

            const params = new URLSearchParams();
            params.append("planta_json", JSON.stringify(planta));

            const URL = `http://localhost:2024/listarPlantasFiltradasFotosBD?${params.toString()}`;

            const opciones = {
                method: "GET",
            };

            fetch(URL, opciones)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error en la respuesta: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const divTablaPlantaFotos = document.getElementById("divTablaPlantaFotos");
                    if (!divTablaPlantaFotos) {
                        console.error("No se pudo encontrar el elemento divTablaPlantaFotos.");
                        alert("Error al mostrar el listado de plantas filtradas.");
                        return;
                    }

                    divTablaPlantaFotos.innerHTML = "";
                    if (data.length === 0) {
                        console.error("No se encontraron plantas que coincidan con los criterios de filtro.");
                        alert("No se encontraron plantas que coincidan con los criterios de filtro.");
                        return;
                    }

                    const tabla = document.createElement("table"); //Creo tabla

                    tabla.className = "table table-bordered table-hover";
                    tabla.style.backgroundColor = "rgb(195, 199, 202)";

                    tabla.innerHTML = `
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Color de la Flor</th>
                                <th>Precio</th>
                                <th>Foto</th>
                                <th>Agregar</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                            <tr>
                                <td colspan="5">Total:</td>
                                <td id="totalPrecio">0</td>
                            </tr>
                        </tfoot>
                    `;

                    const tbody = tabla.querySelector("tbody");
                    const totalPrecioElement = tabla.querySelector("#totalPrecio");

                    if (tbody) {
                        data.forEach((planta: any) => {
                            const fila = document.createElement("tr");
                            
                            fila.innerHTML = `
                                <td>${planta.codigo}</td>
                                <td>${planta.nombre}</td>
                                <td>${planta.color_flor}</td>
                                <td>${planta.precio}</td>
                                <td><img src="http://localhost:2024/${planta.foto}" height="50px" width="50px" /></td>
                                <td><input type="checkbox" class="checkbox-precio" data-precio="${planta.precio}" /></td>
                            `;
                            tbody.appendChild(fila);
                        });

                        // Añadir evento a los checkboxes para actualizar el total de precios
                        const checkboxes = tbody.querySelectorAll(".checkbox-precio");

                        checkboxes.forEach((checkbox: Element) => {
                            checkbox.addEventListener("change", () => {
                                this.actualizarTotalPrecio();
                            });
                        });
                    } else {
                        console.error("No se pudo encontrar el elemento tbody en la tabla.");
                        alert("Error al mostrar el listado de plantas filtradas.");
                    }

                    divTablaPlantaFotos.appendChild(tabla);
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Error al obtener las plantas filtradas.");
                });
        }

        public static actualizarTotalPrecio(): void {
            const checkboxes = document.querySelectorAll(".checkbox-precio:checked");
            let total = 0;

            checkboxes.forEach((checkbox: Element) => {
                const precio = parseFloat((checkbox as HTMLInputElement).dataset.precio!);
                total += precio;
            });

            const totalPrecioElement = document.getElementById("totalPrecio");

            if (totalPrecioElement) {
                totalPrecioElement.textContent = total.toFixed(2).toString();
            }
        }

         
    }

    // Agregar el event listener al final del archivo 
    document.addEventListener('DOMContentLoaded', () => {
        RecPrimerParcial.Manejadora.MostrarPlantasFotosBD();
    });

}

    