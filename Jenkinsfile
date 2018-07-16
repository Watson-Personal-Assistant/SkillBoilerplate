node {
    def branchName = (env.CHANGE_BRANCH == null) ? env.BRANCH_NAME : env.CHANGE_BRANCH
    def gitURL = 'https://github.com/Watson-Personal-Assistant/SkillBoilerplate.git'

    stage('Get the code') {
        checkout([$class: 'GitSCM', branches: [[name: "${branchName}"]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'LocalBranch', localBranch: "**"]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '15eceab6-eceb-4b2b-b62d-6796f9b63acd', url: "${gitURL}"]]])
    }

    stage('install') {
        sh 'npm install'
    }
    stage('replace with current skill-sdk pr') {
        sh "npm uninstall skill-sdk-nodejs"

        // Should get that as a parameter if available - if not get pre-release
        try {
            def sdkBranch = "https://github.com/Watson-Personal-Assistant/skill-sdk-nodejs.git#${branchName}"
            sh "npm install $sdkBranch"
        } catch (Exception e) {
            def sdkBranch = "https://github.com/Watson-Personal-Assistant/skill-sdk-nodejs.git#pre-release"
            sh "npm install $sdkBranch"
        }
    }
    stage('Lint it') {
        // lint here
    }
    stage('npm test') {
        sh 'npm test'
    }
}