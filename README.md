Informe de Proyecto: Procesador de Imágenes Serverless Multientorno en AWS

Datos: Infantes Rondo, Junior David / 000279891

Este proyecto consiste en un sistema que recibe imágenes a través de una API, las guarda de forma segura y las procesa.

Las imagenes de todo el procedimiento que hice está en el pdf. Además, valida que lo trabajado fue en mi cuenta, ya que salen mis datos, en mi caso sale *juniorinfantes15 (382876615060)*



Para probar que el sistema de *Producción* está activo, puede enviar una imagen.

El siguiente codigo escribe al CMD

Hay que tener en cuenta que la parte de *file=@C:\Users\Junior Infantes\Downloads\6216917-middle.png* se va a cambiar dependiendo la ruta de la imagen de la computadora; en mi caso puse eso porque es donde se encuentra.

```bash
curl -X POST "https://vkvk7hoiu0.execute-api.us-east-1.amazonaws.com/prod/upload" -F "file=@C:\Users\Junior Infantes\Downloads\6216917-middle.png"
```

Al ejecututar ese codigo va a salir el mensaje: *{"message":"Imagen subida exitosamente","fileName":"uploads/1778054388237-6216917-middle.png"}*

Esta imagen se va directo al S3 a buckets; en mi caso se llama *"image-processor-storage-junior-2004"*, en la carpeta
*uploads/* se encuentran las imagenes subida al ejecutar el codigo de arriba de CMD.


**DOCUMENTACIÓN DE LAS IMAGENES:**

Imagen del Visual Studio Code (Imagen 1)

Paso 1: Configuración inicial del entorno (Imagen del 2 al 7)

Preparación del terraform, instalación de *"msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi"*, agregué las credenciales creadas en claves de acceso y luego hice init y appy al terraform.

Paso 2: Preparación del VPC (Imagen de 8 al 9)

La creación del VPC *"vpc-02840982d88cc05c4 / VPC-Image"*.

Paso 3: Creación las puertas de enlace de internet (Imagen 10)

Al crear tiene como nombre de: *"igw-Occe37c75d06adac1 / GATEWAY-image"*

Paso 4: Configuración de las subredes (Imagen 11)

La creación de las subredes *PRIV_A*, *PRIV_B*, *PUB_A* Y *PUB_B*

Paso 5: Configuración de las tablas de enrutamiento (Imagen 12)

La creación de las tablas de enrutamiento *rt-private-a* y *rt-private-b*



