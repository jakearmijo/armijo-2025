import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

interface EdgeStackProps extends StackProps {
  envName: string;
  domainName: string;
  altNames: string[];
  originDomainName: string;
}

export class EdgeStack extends Stack {
  public readonly distributionDomainName: string;

  constructor(scope: Construct, id: string, props: EdgeStackProps) {
    super(scope, id, props);

    const cert = new acm.Certificate(this, 'SiteCert', {
      domainName: props.domainName,
      subjectAlternativeNames: props.altNames,
      validation: acm.CertificateValidation.fromDns(),
    });

    const distribution = new cloudfront.Distribution(this, 'Cdn', {
      certificate: cert,
      domainNames: [props.domainName, ...props.altNames],
      defaultBehavior: {
        origin: new origins.HttpOrigin(props.originDomainName, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      },
      defaultRootObject: '',
    });

    this.distributionDomainName = distribution.distributionDomainName;

    new CfnOutput(this, 'CloudFrontDomain', { value: this.distributionDomainName });
  }
}
