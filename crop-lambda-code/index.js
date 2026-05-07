const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const s3Client = new S3Client({ region: "us-east-1" });

exports.handler = async (event) => {
    // SQS puede enviar un lote de mensajes, iteramos (aunque lo configuramos a 1)
    for (const record of event.Records) {
        try {
            // 1. Extraer el evento de S3 desde el mensaje de SQS
            const body = JSON.parse(record.body);
            if (!body.Records) continue; // Si es un mensaje de prueba, ignorar
            
            const s3Event = body.Records[0].s3;
            const bucketName = s3Event.bucket.name;
            const objectKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, " "));

            console.log(`Procesando imagen: ${objectKey}`);

            // 2. Descargar la imagen de S3
            const getObjectResult = await s3Client.send(new GetObjectCommand({
                Bucket: bucketName,
                Key: objectKey
            }));
            const imageBuffer = await getObjectResult.Body.transformToByteArray();

            // 3. Aplicar recorte circular con Sharp
            const size = 300;
            const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" /></svg>`;
            
            const croppedBuffer = await sharp(imageBuffer)
                .resize(size, size)
                .composite([{ input: Buffer.from(circleSvg), blend: 'dest-in' }])
                .toFormat('png')
                .toBuffer();

            // 4. Subir imagen procesada a S3
            const newKey = objectKey.replace('uploads/', 'processed/').replace(/\.[^/.]+$/, ".png");
            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: newKey,
                Body: croppedBuffer,
                ContentType: "image/png"
            }));

            console.log(`Imagen guardada en: ${newKey}`);

        } catch (error) {
            console.error("Error procesando mensaje SQS:", error);
            throw error; // Al lanzar el error, SQS sabe que falló y reintentará o enviará a la DLQ
        }
    }
    return {};
};