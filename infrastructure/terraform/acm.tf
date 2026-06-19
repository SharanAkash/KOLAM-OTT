# AWS Certificate Manager for SSL/TLS Certificate

# Certificate for the domain
resource "aws_acm_certificate" "main" {
  count             = var.domain_name != "" ? 1 : 0
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${var.domain_name}" # Wildcard for subdomains
  ]

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cert"
    Environment = var.environment
  }
}

# Output certificate ARN
output "certificate_arn" {
  value       = var.domain_name != "" ? aws_acm_certificate.main[0].arn : ""
  description = "ARN of the ACM certificate"
}

output "certificate_validation_records" {
  value = var.domain_name != "" ? [
    for dvo in aws_acm_certificate.main[0].domain_validation_options : {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      value  = dvo.resource_record_value
    }
  ] : []
  description = "DNS validation records for certificate"
}
