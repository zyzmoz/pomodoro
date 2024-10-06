node {
  def commit_id

  stage("Preparation") {
    checkout scm

    sh "git rev-parse --short HEAD > .git/commit-id"

    commit_id = readFile('.git/commit-id').trim()
  }

  stage('Build') {
    nodejs(nodeJSInstallationName: 'nodejs18') {
      sh 'npm ci'
      sh 'npm run build'
    }
  }

  stage('Test') {
    nodejs(nodeJSInstallationName: 'nodejs18') {
      sh 'npm run test'
    }
  }
}