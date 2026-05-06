provider "aws" {
  region = "us-east-1"
}

module "sqs_dev" {
  source      = "../../modules/sqs_queue"
  nombre_cola = "image-processor-dev-queue"
}