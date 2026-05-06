provider "aws" {
  region = "us-east-1"
}

module "sqs_qa" {
  source      = "../../modules/sqs_queue"
  nombre_cola = "image-processor-qa-queue"
}