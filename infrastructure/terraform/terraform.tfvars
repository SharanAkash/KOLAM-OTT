# QA Environment Variables
aws_region          = "us-east-1"
environment         = "qa"
project_name        = "kolam-ott"
vpc_cidr            = "10.1.0.0/16"
availability_zones  = ["us-east-1a", "us-east-1b"]

# Database
db_instance_class      = "db.t3.micro"
db_allocated_storage   = 20
db_name                = "kolam_ott_qa"
db_username            = "kolam_qa"

# ECS
ecs_api_cpu    = 512
ecs_api_memory = 1024
ecs_web_cpu    = 256
ecs_web_memory = 512

# Domain and SSL Certificate
domain_name     = "jstamilcenima.duckdns.org"
certificate_arn = ""
