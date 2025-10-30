import 'source-map-support/register';
import { App, Environment, CfnOutput } from 'aws-cdk-lib';
import { DevAppStack } from '../lib/dev-app-stack';
import { EdgeStack } from '../lib/edge-stack';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = new App();

const envName = app.node.tryGetContext('env') ?? 'dev';
const primaryRegion = app.node.tryGetContext('primaryRegion') ?? process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? 'us-east-2';
const domainName: string = app.node.tryGetContext('domainName') ?? 'jakearmijo.com';
const siteSubdomains: string[] = app.node.tryGetContext('siteSubdomains') ?? ['www'];

const account = process.env.CDK_DEFAULT_ACCOUNT ?? process.env.AWS_ACCOUNT_ID;

const appEnv: Environment | undefined = account ? { account, region: primaryRegion } : undefined;
const edgeEnv: Environment | undefined = account ? { account, region: 'us-east-1' } : { region: 'us-east-1' } as Environment;

const devApp = new DevAppStack(app, `DevAppStack-${envName}`, {
  env: appEnv,
  envName,
  crossRegionReferences: true,
});

const edge = new EdgeStack(app, `EdgeStack-${envName}`, {
  env: edgeEnv,
  envName,
  domainName,
  altNames: siteSubdomains.map((s) => `${s}.${domainName}`),
  originDomainName: devApp.albDnsName,
  crossRegionReferences: true,
});

new CfnOutput(devApp, 'AlbDnsOutput', { value: devApp.albDnsName });
new CfnOutput(edge, 'CloudFrontDomainOutput', { value: edge.distributionDomainName });
