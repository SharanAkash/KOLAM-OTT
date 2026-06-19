variable "aws_region" {
  description = "AWS region for QA environment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "qa"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "kolam-ott"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.1.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "db_instance_class" {
  description = "RDS instance class for QA"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "kolam_ott_qa"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "kolam_qa"
}

variable "ecs_api_cpu" {
  description = "CPU units for API task"
  type        = number
  default     = 512
}

variable "ecs_api_memory" {
  description = "Memory for API task (MB)"
  type        = number
  default     = 1024
}

variable "ecs_web_cpu" {
  description = "CPU units for Web task"
  type        = number
  default     = 256
}

variable "ecs_web_memory" {
  description = "Memory for Web task (MB)"
  type        = number
  default     = 512
}

variable "domain_name" {
  description = "Domain name for QA environment"
  type        = string
  default     = "YOUR_DOMAIN.com"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}
