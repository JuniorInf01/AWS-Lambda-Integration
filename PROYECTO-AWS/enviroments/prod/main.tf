provider "aws" {
  region = "us-east-1"
}

module "sqs_prod" {
  source      = "../../modules/sqs_queue"
  nombre_cola = "image-processor-prod-queue"
}