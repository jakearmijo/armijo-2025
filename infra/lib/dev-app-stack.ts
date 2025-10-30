import { Duration, Stack, StackProps, CfnOutput, RemovalPolicy, Annotations } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';

interface DevAppStackProps extends StackProps {
  envName: string;
}

export class DevAppStack extends Stack {
  public readonly albDnsName: string;

  constructor(scope: Construct, id: string, props: DevAppStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', subnetType: ec2.SubnetType.PUBLIC },
      ],
    });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    const repository = new ecr.Repository(this, 'EcrRepo', {
      repositoryName: 'jake-site',
      imageScanOnPush: true,
      lifecycleRules: [{ maxImageCount: 10 }],
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const cpu: number = Number(this.node.tryGetContext('containerCpu') ?? 256);
    const memoryMiB: number = Number(this.node.tryGetContext('containerMemory') ?? 512);

    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu,
      memoryLimitMiB: memoryMiB,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.X86_64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
      executionRole: new iam.Role(this, 'ExecutionRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
        ],
      }),
      taskRole,
    });

    taskDefinition.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'jake-site' }),
      environment: {},
      portMappings: [{ containerPort: 3000 }],
    });

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      publicLoadBalancer: true,
      assignPublicIp: true,
      listenerPort: 80,
    });

    // Ensure zero-downtime style deploys by keeping 100% healthy during updates
    const cfnService = service.service.node.defaultChild as ecs.CfnService;
    cfnService.deploymentConfiguration = {
      minimumHealthyPercent: 100,
      maximumPercent: 200,
    };
    Annotations.of(service.service).acknowledgeWarning('@aws-cdk/aws-ecs:minHealthyPercent', 'Set via CfnService.deploymentConfiguration to 100%');

    service.targetGroup.configureHealthCheck({
      path: '/',
      healthyHttpCodes: '200,301,302',
      interval: Duration.seconds(30),
    });

    service.service.autoScaleTaskCount({ minCapacity: 1, maxCapacity: 3 }).scaleOnCpuUtilization('CpuScale', {
      targetUtilizationPercent: 60,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(30),
    });

    const alb = service.loadBalancer as elbv2.ApplicationLoadBalancer;
    this.albDnsName = alb.loadBalancerDnsName;

    new CfnOutput(this, 'RepositoryUri', { value: repository.repositoryUri });
    new CfnOutput(this, 'AlbDnsName', { value: this.albDnsName });
  }
}
