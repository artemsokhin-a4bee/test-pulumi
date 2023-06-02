import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {
  ReportViolation,
  StackValidationArgs,
  StackValidationPolicy,
  PolicyPack
} from '@pulumi/policy'

const versionTagRequires: StackValidationPolicy = {
  name: 'version-tag-requires',
  description: 'Requires a version tag on every resource that supports it.',
  enforcementLevel: 'mandatory',
  validateStack: (
    args: StackValidationArgs,
    reportViolation: ReportViolation
  ) => {
    const resources = args.resources
    for (const resource of resources) {
      if (resource.type.startsWith('aws:')) {
        const awsResource = resource as any

        if (
          awsResource.props.tags === undefined ||
          awsResource.props.tags.version === undefined
        ) {
          const props: any[] = []
          Object.keys(awsResource.props).forEach(key => props.push(key))

          reportViolation(
            `Version tag required on ${awsResource.name}`,
            awsResource
          )
        }
      }
    }
  }
}

const tests = new PolicyPack('tests-pack', {
  policies: [versionTagRequires]
})
