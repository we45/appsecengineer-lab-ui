const environments = {
  learning: {
    baseURLApi: 'https://vhckklb1xf.execute-api.us-east-2.amazonaws.com/prod/',
    provisionerUrl: 'https://kbgtw5nb85.execute-api.us-east-2.amazonaws.com/prod/',
    webhooksBaseUrl: 'https://8aiww2u0nj.execute-api.us-east-2.amazonaws.com/prod/',
    challengeUrl: 'https://w8w0zirqti.execute-api.us-east-2.amazonaws.com/prod/',
    macroMetaUrl: 'https://ljnq2nx5ie.execute-api.us-east-2.amazonaws.com/prod/',
    testsUrl: 'https://j0u9ovucy2.execute-api.us-east-2.amazonaws.com/prod/',
    badgeUrl: '',
    baseURLEnterprise: 'https://8aiww2u0nj.execute-api.us-east-2.amazonaws.com/prod/checkout/enterprise',
    baseURLIndividual: 'https://8aiww2u0nj.execute-api.us-east-2.amazonaws.com/prod/checkout/individual',
    googleOauthUrl:
      'https://auth.learning.appsecengineer.com/oauth2/authorize?response_type=code&client_id=44hnt71r6r0mj3bc9lc7v2hsna&redirect_uri=https://learning.appsecengineer.com/callback&identity_provider=Google',
    socketUrl: 'wss://xmf94r5sy9.execute-api.us-east-2.amazonaws.com/prod',
    analytics: 'https://33lh4tyaj2.execute-api.us-east-2.amazonaws.com/prod/',
    secret: 'https://api.appsecengineer.app/enterprise/scim/v1',
    clientTenantId: '44hnt71r6r0mj3bc9lc7v2hsna',
    tenantBaseUrl: 'auth.learning.appsecengineer.com',
    tenantCallbackUrl: 'learning.appsecengineer.com',
    asegptUrl: 'https://zp56bu78ma.execute-api.us-east-2.amazonaws.com/prod/',
    quiz: 'https://32d8fx0t13.execute-api.us-east-2.amazonaws.com/prod/',
    generateTokenUrl: 'https://api.appsecengineer.app/enterprise/',
    integrationUrl: 'https://api.appsecengineer.app/enterprise/',
    scormUrl: 'https://api.appsecengineer.app/enterprise/',
    g2TokenUrl: 'https://jlpzpqnt9h.execute-api.us-east-2.amazonaws.com/prod/',
    aiGeneratorUrlApi: 'https://zp2st41q69.execute-api.us-east-2.amazonaws.com/prod',
    clearFeedClientId: 'ae670f42-722d-4402-accb-a40fe58316dd',
    tagsUrl: 'https://m6d6yt7pie.execute-api.us-east-2.amazonaws.com/prod/'
  },
  uat: {
    baseURLApi: 'https://0tcy9w9c95.execute-api.us-west-1.amazonaws.com/uat/',
    provisionerUrl: 'https://nace643xe0.execute-api.us-west-1.amazonaws.com/uat/',
    webhooksBaseUrl: 'https://au2voe1lsc.execute-api.us-west-1.amazonaws.com/uat/',
    challengeUrl: 'https://i77i9zva54.execute-api.us-west-1.amazonaws.com/uat/',
    macroMetaUrl: 'https://a22synxbk7.execute-api.us-west-1.amazonaws.com/uat/',
    testsUrl: 'https://jpekencwud.execute-api.us-west-1.amazonaws.com/uat/',
    badgeUrl: '',
    baseURLEnterprise: 'https://au2voe1lsc.execute-api.us-west-1.amazonaws.com/uat/checkout/enterprise',
    baseURLIndividual: 'https://au2voe1lsc.execute-api.us-west-1.amazonaws.com/uat/checkout/individual',
    socketUrl: 'wss://xvph76uttl.execute-api.us-west-1.amazonaws.com/uat',
    analytics: 'https://vtc6iaqj20.execute-api.us-west-1.amazonaws.com/uat/',
    secret: 'https://api.uat.appsecengineer.app/enterprise/scim/v1',
    asegptUrl: 'https://8hqy7jf2o3.execute-api.us-east-2.amazonaws.com/staging/',
    quiz: 'https://08b1ivq1g7.execute-api.us-west-1.amazonaws.com/uat',
    generateTokenUrl: 'https://api.uat.appsecengineer.app/enterprise/',
    integrationUrl: 'https://api.uat.appsecengineer.app/enterprise/',
    scormUrl: 'https://api.uat.appsecengineer.app/enterprise/'
  },
  staging: {
    baseURLApi: 'https://m6d6yt7pie.execute-api.us-east-2.amazonaws.com/staging/',
    provisionerUrl: 'https://h19cb5qx00.execute-api.us-east-2.amazonaws.com/staging/',
    webhooksBaseUrl: 'https://qz41o4r8k5.execute-api.us-east-2.amazonaws.com/staging/',
    challengeUrl: 'https://9ismepcb43.execute-api.us-east-2.amazonaws.com/staging/',
    macroMetaUrl: 'https://b398t74m8h.execute-api.us-east-2.amazonaws.com/staging/',
    testsUrl: 'https://w6tkex3n5m.execute-api.us-east-2.amazonaws.com/staging/',
    badgeUrl: 'https://1sngapgw57.execute-api.us-east-2.amazonaws.com/staging/',
    baseURLEnterprise: 'https://qz41o4r8k5.execute-api.us-east-2.amazonaws.com/staging/checkout/enterprise',
    baseURLIndividual: 'https://qz41o4r8k5.execute-api.us-east-2.amazonaws.com/staging/checkout/individual',
    googleOauthUrl:
      'https://auth.staging.learning.appsecengineer.com/oauth2/authorize?response_type=code&client_id=7kfpv3oqpdfkrd5h7imhd0vee4&redirect_uri=https://staging.learning.appsecengineer.com/callback&identity_provider=Google',
    socketUrl: `wss://dm315313c2.execute-api.us-east-2.amazonaws.com/staging`,
    analytics: 'https://1clk7vx0b2.execute-api.us-east-2.amazonaws.com/staging/',
    quiz: 'https://91gulcsfbg.execute-api.us-east-2.amazonaws.com/staging/',
    secret: 'https://api.staging.appsecengineer.app/enterprise/scim/v1',
    asegptUrl: 'https://8hqy7jf2o3.execute-api.us-east-2.amazonaws.com/staging/',
    integrationUrl: 'https://api.staging.appsecengineer.app/enterprise/',
    scormUrl: 'https://api.staging.appsecengineer.app/enterprise/',
    certificationsUrl: 'https://cyvrklphx1.execute-api.us-east-2.amazonaws.com/staging/',
    clientTenantId: '7kfpv3oqpdfkrd5h7imhd0vee4',
    tenantBaseUrl: 'auth.staging.learning.appsecengineer.com',
    tenantCallbackUrl: 'staging.learning.appsecengineer.com',
    generateTokenUrl: 'https://api.staging.appsecengineer.app/enterprise/',
    g2TokenUrl: 'https://bqa4oikzeb.execute-api.us-east-2.amazonaws.com/staging/',
    aiGeneratorUrlApi: 'https://xkuniyvwc0.execute-api.us-east-2.amazonaws.com/staging/'
  }
}

const subdomain = window.location.hostname.split('.')[0]
const config = environments[subdomain] || environments.staging

if (subdomain === 'learning') {
  window?.Chargebee.init({
    site: 'appsec',
    publishableKey: 'live_MTFcdtDYs3sdEv82UGOcdVovLiQ5KISeNt'
  })
} else {
  window?.Chargebee?.init({
    site: 'appsec-test',
    publishableKey: 'test_ycdOKW6COoEWXhvFDePb3SIcdkME7usuDp'
  })
}

export default config
