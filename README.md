Datos: Infantes Rondo, Junior David / 000279891

Este proyecto consiste en un sistema que recibe imágenes a través de una API, las guarda de forma segura y las procesa.

Las imagenes de todo el procedimiento que hice está en el pdf. Además, valida que lo trabajado fue en mi cuenta, ya que salen mis datos, en mi caso sale *juniorinfantes15 (382876615060)*

Para probar que el sistema de *Producción* está activo, puede enviar una imagen.

*El siguiente codigo escribe al CMD*

Hay que tener en cuenta que la parte de *file=@C:\Users\Junior Infantes\Downloads\6216917-middle.png* se va a cambiar dependiendo la ruta de la imagen de la computadora; en mi caso puse eso porque es donde se ubica.

```bash
curl -X POST "https://vkvk7hoiu0.execute-api.us-east-1.amazonaws.com/prod/upload" -F "file=@C:\Users\Junior Infantes\Downloads\6216917-middle.png"
```

Al ejecututar ese codigo va a salir el mensaje: *{"message":"Imagen subida exitosamente","fileName":"uploads/1778054388237-6216917-middle.png"}*

Esta imagen se va directo al S3 a buckets; en mi caso se llama *"image-processor-storage-junior-2004"*, en la carpeta
*uploads/* se encuentran las imagenes subida al ejecutar el codigo de arriba de CMD.


**DOCUMENTACIÓN DE LAS IMAGENES:**

Imagen del Visual Studio Code (Imagen 1)

**Paso 1: Configuración inicial del entorno (Imagen del 2 al 7)**

Preparación del entorno Terraform, instalación de AWS CLI mediante el comando *"msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi"*. Luego se configuraron las credenciales de acceso utilizando las claves generadas desde AWS IAM para permitir la autenticación con la cuenta de AWS.

**Paso 2: Preparación del VPC (Imagen de 8 al 9)**

Creación de la VPC denominada *"vpc-02840982d88cc05c4 / VPC-Image"*, la cual funcionará como red privada principal para alojar todos los recursos de la infraestructura desplegada.

**Paso 3: Creación las puertas de enlace de internet (Imagen 10)**

Creación del Internet Gateway con nombre *"igw-Occe37c75d06adac1 / GATEWAY-image"*, el cual permite que los recursos públicos de la VPC tengan acceso a internet.

**Paso 4: Configuración de las subredes (Imagen 11)**

Creación de las subredes:

*PRIV_A*, *PRIV_B*, *PUB_A* Y *PUB_B*

Las subredes públicas permiten el acceso a internet mediante el Internet Gateway, mientras que las privadas se utilizan para alojar recursos internos con mayor seguridad y sin exposición directa a internet.

**Paso 5: Configuración de las tablas de enrutamiento (Imagen 12)**

Creación de las tablas de enrutamiento *rt-private-a* y *rt-private-b*, encargadas de definir las rutas de comunicación dentro de la VPC.

Estas tablas permiten dirigir correctamente el tráfico hacia internet, NAT Gateway u otros recursos internos dependiendo del tipo de subred configurada.

**Paso 6: Configuración de las Gateways NAT (Imagen 13)**

Creación de las NAT Gateways *NAT_A2* y *NAT_B2*, utilizadas para permitir que las subredes privadas puedan acceder a internet sin exponer directamente sus recursos.

Esto permite descargar paquetes, realizar actualizaciones o comunicarse con servicios externos manteniendo la seguridad de las instancias privadas.

**Paso 7: Configuración de los puntos de enlace (Imagen 14 al 16)**

Creación de los VPC Endpoints o puntos de enlace privados para permitir la comunicación entre la VPC y servicios AWS sin necesidad de utilizar internet pública.

Esto mejora la seguridad y optimiza el tráfico interno dentro de la infraestructura desplegada con Terraform.

**Paso 8: Configuración de buckets (Imagen 17 al 18)**

Creación de los buckets en Amazon S3 con el nombre *"image-processor-storage-junior-2004"*, utilizado para almacenar las imágenes del proyecto. Dentro del bucket se crearon las carpetas *processed* y *uploads*, donde una almacena las imágenes originales y la otra las imágenes procesadas automáticamente por Lambda.

Además, se configuró una notificación de eventos llamada *"NotificarNuevaImagen"*, encargada de detectar automáticamente cuando se sube una nueva imagen al bucket y activar el flujo de procesamiento.

**Paso 9: Configuración de las colas (Imagen 19 al 20)**

Creación de la cola SQS llamada *"image-processor-main-queue"*, utilizada para gestionar los mensajes y eventos generados durante el procesamiento de imágenes.

También se configuró una política de acceso vinculando la cola y el bucket S3 para permitir la comunicación segura entre ambos servicios y garantizar que los eventos sean enviados correctamente hacia la cola.

**Paso 10: Configuración de roles (Imagen 21 al 28)**

Creación de los roles IAM *"crop-lambda-role"* y *"upload-lambda-role"*, los cuales permiten asignar permisos específicos a cada función Lambda según sus responsabilidades dentro del sistema.

Por ejemplo:

- Dentro de *"upload-lambda-role"* se creó la política *"S3UploadPermission"*, la cual permite subir y escribir archivos dentro del bucket S3.
- Dentro de *"crop-lambda-role"* se creó la política *"CropProcessorPermission"*, que cuenta con permisos adicionales como lectura, escritura y procesamiento de imágenes almacenadas en S3.

Esto permite mantener un control de acceso más seguro y organizado dentro de la infraestructura AWS.

**Paso 11: Configuración del Lambda (Imagen 29 al 32)**

Creación de las funciones Lambda *"crop-lambda"* y *"upload-lambda"*, conectadas a la VPC y asociadas a sus respectivas subredes privadas para mantener una arquitectura segura.

Cada función fue configurada con su respectivo rol IAM y permisos correspondientes. Además, se agregó el desencadenador mediante SQS utilizando el ARN:

*"arn:aws:sqs:us-east-1:382876615060:image-processor-main-queue"*

Esto permite que las funciones Lambda respondan automáticamente a los mensajes generados en la cola.

**Paso 12: Configuración de la API HTTP (Imagen 33 al 34)**

Creación de la API HTTP llamada *"image-processor-api"* utilizando API Gateway, permitiendo exponer un endpoint para la carga de imágenes.

La API fue integrada con la función Lambda *"upload-lambda"* utilizando el método POST, permitiendo que las solicitudes enviadas desde Postman o CMD sean procesadas automáticamente y almacenadas en S3.

**Paso 13: Código del Lambda (Imagen 35 al 36)**

Se realizó la carga del código fuente de las funciones Lambda *"upload-lambda"* y *"crop-lambda"*.

El archivo principal utilizado fue index.js, encargado de gestionar la lógica de carga y procesamiento de imágenes. El código implementado puede visualizarse en el repositorio de GitHub del proyecto.

**Paso 14: Pruebas con Postman y CMD (Imagen 37 al 38)**

Se realizaron pruebas de funcionamiento utilizando Postman y la consola CMD para verificar el correcto funcionamiento de la API y las funciones Lambda.

En Postman se utilizó el método POST con el endpoint:

*"https://vkvk7hoiu0.execute-api.us-east-1.amazonaws.com/upload"*

En la sección Body > form-data se utilizó la key file y se seleccionó una imagen desde el equipo. Como resultado se obtuvo el mensaje:

*"{"message":"Imagen subida exitosamente","fileName":"uploads/1777884953527-neon-logomark-dark-color.png"}"*

También se realizó la prueba mediante CMD utilizando el comando curl:

*curl -X POST "https://vkvk7hoiu0.execute-api.us-east-1.amazonaws.com/prod/upload" -F "file=@C:\Users\Junior Infantes\Downloads\fotito.png"*

Obteniendo como respuesta:

*"{"message":"Imagen subida exitosamente","fileName":"uploads/1778045653584-fotito.png"}"*

**Paso 15: Eventos de registro y almacenamiento de imágenes (Imagen 39 al 40)**

Visualización de los registros y eventos generados durante la ejecución de las funciones Lambda, permitiendo monitorear el procesamiento y detectar posibles errores o mensajes del sistema.

Además, se verifica que las imágenes cargadas se almacenan correctamente dentro de la carpeta *"uploads"* del bucket S3.

**Paso 16: Destrucción de Terraform (Imagen 41 al 42)**

Finalmente, se ejecutó el comando:

*"terraform destroy"*

Este comando permite eliminar automáticamente todos los recursos creados por Terraform dentro de AWS.

Durante el proceso, Terraform solicita una confirmación escribiendo "yes", y posteriormente inicia la destrucción completa de la infraestructura desplegada.





