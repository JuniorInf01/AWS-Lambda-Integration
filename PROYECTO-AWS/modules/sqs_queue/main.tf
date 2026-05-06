resource "aws_sqs_queue" "mi_cola" {
  name                      = var.nombre_cola
  message_retention_seconds = 86400 # Los mensajes duran 1 día si no se procesan
}