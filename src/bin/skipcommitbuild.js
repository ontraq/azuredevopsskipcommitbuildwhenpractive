#!/usr/bin/env node

import axios from 'axios';
import minimist from 'minimist';
import fs from 'fs';

var argv = minimist(process.argv,
{
   default: {
      orgName: 'ORGNAME',
      projectName: 'PROJECTNAME',
      repoName: 'REPONAME',
      branchName: 'BRANCHNAME',
      buildReason: 'PullRequest'
   }
});
// pat.json file format
// {
//    "PAT": "Basic PATTOKEN"
// }
try {
  const data = fs.readFileSync('./pat.json', 'utf8')
  axios.defaults.headers.common['Authorization'] = JSON.parse(data).PAT;
  let url='https://dev.azure.com/' + argv.orgName + '/' + argv.projectName + '/_apis/git/repositories/' + argv.repoName + '/pullrequests?$top=1000&searchCriteria.status=active&api-version=6.1-preview.1';
  axios.get(url)
       .then(function (response) {
          var jsondoc = response.data;
          const result = jsondoc.value.filter(pr => pr.sourceRefName === argv.branchName);
  	if (result.length > 0  && argv.buildReason != 'PullRequest') {
  	   //skip commit build if current build is for the passed branch commit and the branch has an active pull request
  	   console.log("1");
  	} else {
        console.log('0');
  	}
       })
       .catch(function (error) {
         // handle error
          console.log('error: ');
          console.log(error);
       });
} catch (err) {
  console.error(err)
}

