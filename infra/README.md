# Infra (CDK) - dev

Single-account, single-env (dev) CDK setup:
- DevAppStack (primary region): VPC (2 AZ, no NAT), ECR, ECS Fargate with public tasks, ALB (HTTP)
- EdgeStack (us-east-2): ACM cert for `jakearmijo.com` + `www`, CloudFront pointing to ALB

## Prereqs
- AWS account credentials configured
- CDK bootstrapped in both regions:
  - cdk bootstrap aws://<ACCOUNT_ID>/<PRIMARY_REGION>
  - cdk bootstrap aws://<ACCOUNT_ID>/us-east-2

## Context (cdk.json)
- env: dev
- primaryRegion: your app region (defaults to us-east-2)
- domainName: jakearmijo.com
- siteSubdomains: ["www"]

## Deploy
- npm ci
- npm run build
- npx cdk synth
- npx cdk deploy --all --require-approval never -c env=dev

Then add Cloudflare DNS:
- Create/verify ACM DNS records (CDK outputs during deploy)
- Point apex and www (DNS-only) to the CloudFront domain output

## App image
- ECR repo: jake-site (output shown)
- Push image with tag `latest` (or adjust CDK to use your tag)
- ECS service uses public tasks (assignPublicIp) to reach the NHL API without NAT

## Notes
- For HTTPS origin, add an ALB certificate in the primary region and change CloudFront origin to HTTPS.
- To keep costs low, no NAT, no WAF initially. Add later if needed.
