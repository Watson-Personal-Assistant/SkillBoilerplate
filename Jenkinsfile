properties([[$class: 'BuildBlockerProperty', blockLevel: 'GLOBAL', blockingJobs: '', scanQueueFor: 'ALL', useBuildBlocker: true], disableConcurrentBuilds(), [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false], parameters([string(defaultValue: 'pre-release', description: 'The SDK Branch to install', name: 'sdkBuildBranch', trim: false)]), [$class: 'ThrottleJobProperty', categories: [], limitOneJobWithMatchingParams: false, maxConcurrentPerNode: 0, maxConcurrentTotal: 0, paramsToUseForLimit: '', throttleEnabled: false, throttleOption: 'project']])

node {
    def branchName = (env.CHANGE_BRANCH == null) ? env.BRANCH_NAME : env.CHANGE_BRANCH
    def gitURL = 'https://github.com/Watson-Personal-Assistant/SkillBoilerplate.git'
    def (folderName, jobName) = env.JOB_NAME.tokenize('/')
    def boilerplateName = 'Skill-Boilerplate'

    stage('Get the code') {
        checkout([$class: 'GitSCM', branches: [[name: "${branchName}"]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'LocalBranch', localBranch: "**"]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '15eceab6-eceb-4b2b-b62d-6796f9b63acd', url: "${gitURL}"]]])
    }

    stage('install') {
        sh 'npm install'
    }
    stage('replace with current skill-sdk pr') {
        sh "npm uninstall skill-sdk-nodejs"

        def sdkBranch = "https://github.com/Watson-Personal-Assistant/skill-sdk-nodejs.git#${params.sdkBuildBranch}"
        sh "npm install $sdkBranch"
    }
    stage('Lint it') {
        // lint here
    }
    stage('npm test') {
        def ciMode = (folderName == boilerplateName);

        sh "isCI=$ciMode npm test"
    }
}