variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "ai-notes"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "anthropic_api_key" {
  description = "Anthropic API key stored as secret"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Backend Docker image URI (ECR)"
  type        = string
}

variable "frontend_image" {
  description = "Frontend Docker image URI (ECR)"
  type        = string
}
