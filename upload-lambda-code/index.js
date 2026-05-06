const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multipart = require("parse-multipart-data");

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "image-processor-storage-junior-2004";

exports.handler = async (event) => {
    try {
        // 1. Extraer el boundary del header Content-Type
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        const boundary = contentType.split('boundary=')[1];

        // 2. Decodificar el cuerpo (API Gateway lo envía en base64)
        const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');

        // 3. Parsear el multipart
        const parts = multipart.parse(bodyBuffer, boundary);
        const imagePart = parts.find(part => part.filename); // Busca la parte que sea un archivo

        if (!imagePart) {
            return { statusCode: 400, body: "No se encontró ninguna imagen en la petición" };
        }

        // 4. Generar nombre único y subir a S3
        const fileName = `uploads/${Date.now()}-${imagePart.filename}`;
        
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: imagePart.data,
            ContentType: imagePart.type
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Imagen subida exitosamente", fileName })
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error interno del servidor" };
    }
};