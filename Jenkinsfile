node {
  def commit_id

  stage("Preparation") {
    checkout scm

    sh "git rev-parse --short HEAD > .git/commit-id"

    commit_id = readFile('.git/commit-id').trim()
  }

  stage('Test') {
    nodejs(nodeJSInstallationName: 'nodejs18') {
      sh 'npm ci -D'
      sh 'npm run test'
    }
  }
}