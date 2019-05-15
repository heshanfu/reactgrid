pipeline {
  agent any
  stages {
    // stage('npm') {	
    //   steps {	
    //     bat 'npm install'	
    //   }
    // }

    stage('update files') {
      steps {
        // withCredentials([usernamePassword(credentialsId: 'c7a6351c-c618-4e94-88d9-1020cf897fbb', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
        //   bat "echo $USERNAME"
        // }
        bat "git config --global user.email \"p.mikosza@outlook.com\""
        bat "git config --global user.name \"miki10194\""
        bat "git config --global push.default matching"
        dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          bat "git pull https://eb2eb8995fd97fa2c5f31aab23b0cd798e2f3505@github.com/silevis/dynagrid.git test"
        }
      }
    }
    
    // stage('tests') {
    //   steps {
    //     script {
    //       if (env.CHANGE_ID) { // if pipeline is triggered by pull request
    //         dir(path: 'c:/users/lenovo/desktop/dynagrid-for-testing') {
    //           bat "npm run test:automatic"
    //         }
    //       }
    //     }
    //   }
    // }
  }

  options {
    disableConcurrentBuilds()
  }

  post {
    success {
      script {
        if (env.BRANCH_NAME == 'test') {
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "npm version patch && npm publish"
          // }
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "git remote set-url origin "
          // }
          dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
            // bat "git push origin test"
            // sshagent(credentials: ['94462115-8e05-4850-933c-67971f831b1c']) {
            //   bat "git pull origin test"
            // }
            // powershell "ssh-add -l"
          }
        }
       }  
    }

    cleanup {
      /* clean up our workspace */
      deleteDir()
      dir("${workspace}@tmp") {
        deleteDir()
      }
      dir("${workspace}@script") {
        deleteDir()
      }
      dir("${workspace}@script@tmp") {
        deleteDir()
      }
    }

    failure {
      emailext(to: 'piotr.mikosza@silevis.com', subject: "${env.JOB_NAME} ended with failure!", body: "Somethin was wrong! \n\nConsole: ${env.BUILD_URL}.\n\n")
    }
  }

  tools {
    nodejs 'node-v10.15.3'
  }
}
