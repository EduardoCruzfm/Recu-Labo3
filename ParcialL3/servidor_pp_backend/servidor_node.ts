const express = require('express');

const app = express();

app.set('puerto', 2024);

//AGREGO CORS (por default aplica a todos los 'origin')
const cors = require("cors");

//AGREGO MW 
app.use(cors());

//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));


//AGREGO FILE SYSTEM
const fs = require('fs');

//AGREGO JSON
app.use(express.json());

//AGREGO MULTER
const multer = require('multer');

//AGREGO MIME-TYPES
const mime = require('mime-types');

//AGREGO STORAGE
const storage = multer.diskStorage({

    destination: "public/imagenes/",
});

const upload = multer({

    storage: storage
});

//AGREGO MYSQL y EXPRESS-MYCONNECTION
const mysql = require('mysql');
const myconn = require('express-myconnection');
const db_options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'buzon'
};

//AGREGO MW 
app.use(myconn(mysql, db_options, 'single'));

//AGREGO BODY-PARSER
const body_parser = require('body-parser');

//AGREGO MW
app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

//##############################################################################################//
//RUTAS PARA EL CRUD - CON BD -
//##############################################################################################//

//LISTAR SOBRES
app.get('/sobre', (request:any, response:any)=>{

    let obj : any = {};

    obj.exito = false;
    obj.sobres = null;

    request.getConnection((err:any, conn:any)=>{

        if(err)
        {
            console.log("Error al conectarse a la base de datos.\n" + err.sqlMessage);           
        }
        else
        {
            conn.query("select * from sobres", (err:any, rows:any)=>{

                if(err)
                {
                    console.log("Error en consulta de base de datos.\n"+err.sqlMessage);
                } 
                else
                {
                    obj.exito = true;
                    obj.sobres = rows;
                 
                    response.json(obj);
                }
            });
        }
    });

});

//TRAER SOBRES POR REMITENTE
app.get('/sobre/:remitente', (request:any, response:any)=>{

    let obj : any = {};

    obj.exito = false;
    obj.sobres = null;

    request.getConnection((err:any, conn:any)=>{

        if(err)
        {
            console.log("Error al conectarse a la base de datos.\n" + err.sqlMessage);           
        }
        else
        {
            conn.query("select * from sobres where remitente = ?", [request.params.remitente], (err:any, rows:any)=>{

                if(err)
                {
                    console.log("Error en consulta de base de datos.\n"+err.sqlMessage);
                } 
                else
                {
                    obj.exito = true;
                    obj.sobres = rows;
                 
                    response.json(obj);
                }
            });
        }
    });

});

//AGREGAR SOBRE
app.post('/sobre', (request:any, response:any)=>{
   
    let obj : any = {};
    let obj_sobre = request.body;

    request.getConnection((err:any, conn:any)=>{

        if(err) 
        {
            console.log("Error al intentar conectarse a la bd.");

            obj.exito = false;
            obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;;
        }
        else
        {
            conn.query("insert into sobres set ?", [obj_sobre], (err:any, rows:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {
                    obj.exito = true;
                    obj.mensaje = "Sobre agregado en la bd.";
                }
            
                response.json(obj);
            });
        }
    });
});

//MODIFICAR SOBRE
app.put('/sobre', (request:any, response:any)=>{
    
    let obj : any = {};
    let params = JSON.parse(JSON.stringify(request.body));
    let obj_sobre = (params.sobre_json);

    let obj_modif : any = {};
    //para excluir la pk (codigo)
    obj_modif.direccion_destinatario = obj_sobre.direccion_destinatario;
    obj_modif.remitente = obj_sobre.remitente;
    obj_modif.precio_estampilla = obj_sobre.precio_estampilla;

    request.getConnection((err:any, conn:any)=>{

        if(err) 
        {
            console.log("Error al intentar conectarse a la bd.");

            obj.exito = false;
            obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;;
        }
        else
        {
            conn.query("update sobres set ? where id = ?", [obj_modif, obj_sobre.id], (err:any, rows:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {
                    obj.exito = true;
                    obj.mensaje = "Sobre modificado en la bd.";
                }
            
                response.json(obj);
            });
        }
    });
});

//ELIMINAR SOBRE
app.delete('/sobre', (request:any, response:any)=>{
   
    let obj : any = {};
    let id = request.body.id;

    request.getConnection((err:any, conn:any)=>{

        if(err) 
        {
            console.log("Error al intentar conectarse a la bd.");

            obj.exito = false;
            obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;;
        }
        else
        {
            conn.query("delete from sobres where id = ?", [id], (err:any, rows:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {
                    obj.exito = true;
                    obj.mensaje = "Sobre eliminado de la bd.";
                }
            
                response.json(obj);
            });
        }
    });
});

//LISTAR POSTALES
app.get('/postal', (request:any, response:any)=>{

    let obj : any = {};

    obj.exito = false;
    obj.postales = null;

    request.getConnection((err:any, conn:any)=>{

        if(err)
        {
            console.log("Error al conectarse a la base de datos.\n" + err.sqlMessage);           
        }
        else
        {
            conn.query("SELECT * FROM postales", (err:any, rows:any)=>{

                if(err)
                {
                    console.log("Error en consulta de base de datos.\n"+err.sqlMessage);
                } 
                else
                {
                    obj.exito = true;
                    obj.postales = rows;
                 
                    response.json(obj);
                }
            });
        }
    });
});

//AGREGAR
app.post('/postal', upload.single("imagen"), (request:any, response:any)=>{

    let file = request.file;
    let extension = mime.extension(file.mimetype);

    let obj : any = {};
    let obj_postal_str = JSON.parse(JSON.stringify(request.body));
    let obj_postal = JSON.parse(obj_postal_str.obj_postal);

    let path : string = file.destination + obj_postal.remitente + "." + extension;
    fs.renameSync(file.path, path);

    obj_postal.imagen = path.split("public/")[1];

    request.getConnection((err:any, conn:any)=>{

        if(err) 
        {
            console.log("Error al intentar conectarse a la bd.");

            obj.exito = false;
            obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;;
        }
        else
        {
            conn.query("insert into postales set ?", [obj_postal], (err:any, rows:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {
                    obj.exito = true;
                    obj.mensaje = "Postal agregada en la bd.";
                }
            
                response.json(obj);
            });
        }
    });
});

//MODIFICAR
app.put('/postal/:id', upload.single("imagen"), (request:any, response:any)=>{
    
    let file = request.file;
    let extension = mime.extension(file.mimetype);

    let obj : any = {};
    let obj_postal : any = {};

    let obj_postal_str = JSON.parse(JSON.stringify(request.body));
    let postal_json = JSON.parse(obj_postal_str.postal_json);

    obj_postal.direccion_destinatario = postal_json.direccion_destinatario;
    obj_postal.remitente = postal_json.remitente;
    obj_postal.precio_estampilla = postal_json.precio_estampilla;

    let path : string = file.destination + obj_postal.remitente + "." + extension;
    fs.renameSync(file.path, path);

    obj_postal.imagen = path.split("public/")[1];
    let path_imagen : string = "/";

    request.getConnection((err:any, conn:any)=>{

        if(err) 
        {
            console.log("Error al intentar conectarse a la bd.");

            obj.exito = false;
            obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;
        }
        else
        {
            //obtengo el path de la imagen del producto a ser eliminado
            conn.query("select imagen from postales where id = ?", [request.params.id], (err:any, result:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {               
                    path_imagen += result[0].imagen;
                }
            });

            conn.query("update postales set ? where id = ?", [obj_postal, request.params.id], (err:any, rows:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {
                    obj.exito = true;
                    obj.mensaje = "Postal modificada en la bd.";

                    fs.unlink("public/"+path_imagen, (err:any) => {
                        if (err) 
                        {
                            console.log("no se pudo borrar "+ path_imagen + " - "+err);
                        }
                        else
                        {
                            console.log(path_imagen + ' fue borrado.');
                        }
                        
                    });
                }
            
                response.json(obj);
            });
        }
    });
});

//ELIMINAR
app.delete('/postal/:id',(request:any, response:any)=>{
   
    let obj : any = {};
    let path_imagen : string = "public/";
    let id = request.params.id;

    request.getConnection((err:any, conn:any)=>{

        if(err) 
        {
            console.log("Error al intentar conectarse a la bd.");

            obj.exito = false;
            obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;
        }
        else
        {
            //obtengo el path de la imagen del producto a ser eliminado
            conn.query("select imagen from postales where id = ?", [id], (err:any, result:any)=>{

                if(err) 
                {
                    console.log("Error en consulta de base de datos.");

                    obj.exito = false;
                    obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                }
                else
                {               
                    path_imagen += result[0].imagen;
                }
            });
        }

        request.getConnection((err:any, conn:any)=>{

            if(err) 
            {
                console.log("Error al intentar conectarse a la bd.");

                obj.exito = false;
                obj.mensaje = "Error al intentar conectarse a la bd.\n"+err.sqlMessage;;
            }
            else
            {
                conn.query("delete from postales where id = ?", [id], (err:any, rows:any)=>{

                    if(err) 
                    {
                        console.log("Error en consulta de base de datos.");

                        obj.exito = false;
                        obj.mensaje = "Error en consulta de base de datos.\n"+err.sqlMessage;
                    }
                    else
                    {
                        obj.exito = true;
                        obj.mensaje = "Postal eliminada de la bd.";

                        fs.unlink(path_imagen, (err:any) => {
                            if (err) 
                            {
                                console.log("no se pudo borrar "+ path_imagen + " - "+err);
                            }
                            else
                            {
                                console.log(path_imagen + ' fue borrado.');
                            }                            
                        });
                    }
                
                    response.json(obj);
                });
            }
        });
    }); 
});



app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});