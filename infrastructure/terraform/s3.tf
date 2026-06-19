# S3 Bucket for QA Video Storage
resource "aws_s3_bucket" "qa_videos" {
  bucket = "${var.project_name}-${var.environment}-videos"

  tags = {
    Name        = "${var.project_name}-${var.environment}-videos"
    Environment = var.environment
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "qa_videos" {
  bucket = aws_s3_bucket.qa_videos.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "qa_videos" {
  bucket = aws_s3_bucket.qa_videos.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "qa_videos" {
  bucket = aws_s3_bucket.qa_videos.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket CORS Configuration
resource "aws_s3_bucket_cors_configuration" "qa_videos" {
  bucket = aws_s3_bucket.qa_videos.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = [
      "https://qa.${var.domain_name}",
      "https://api-qa.${var.domain_name}"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 Lifecycle Policy for Cost Optimization
resource "aws_s3_bucket_lifecycle_configuration" "qa_videos" {
  bucket = aws_s3_bucket.qa_videos.id

  rule {
    id     = "transition-old-videos"
    status = "Enabled"

    filter {}

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }
  }

  rule {
    id     = "cleanup-incomplete-uploads"
    status = "Enabled"

    filter {}

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# IAM User for S3 Access (for API service)
resource "aws_iam_user" "qa_s3_user" {
  name = "${var.project_name}-${var.environment}-s3-user"
  path = "/system/"

  tags = {
    Name        = "${var.project_name}-${var.environment}-s3-user"
    Environment = var.environment
  }
}

# IAM Access Key for S3 User
resource "aws_iam_access_key" "qa_s3_user" {
  user = aws_iam_user.qa_s3_user.name
}

# IAM Policy for S3 Bucket Access
resource "aws_iam_user_policy" "qa_s3_user_policy" {
  name = "${var.project_name}-${var.environment}-s3-policy"
  user = aws_iam_user.qa_s3_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetObjectVersion",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.qa_videos.arn,
          "${aws_s3_bucket.qa_videos.arn}/*"
        ]
      }
    ]
  })
}

# Output S3 credentials
output "s3_bucket_name" {
  value       = aws_s3_bucket.qa_videos.id
  description = "Name of the QA S3 bucket"
}

output "s3_bucket_arn" {
  value       = aws_s3_bucket.qa_videos.arn
  description = "ARN of the QA S3 bucket"
}

output "s3_access_key_id" {
  value       = aws_iam_access_key.qa_s3_user.id
  description = "Access key ID for S3"
  sensitive   = true
}

output "s3_secret_access_key" {
  value       = aws_iam_access_key.qa_s3_user.secret
  description = "Secret access key for S3"
  sensitive   = true
}
