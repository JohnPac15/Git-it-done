var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning")
var repoNameEl = document.querySelector("#repo-name");

getRepoName = function(){
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    

    if(repoName) {
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
      }else {
          document.location.replace("./index.html")
      }
}

getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    fetch(apiUrl).then(function(response){
        //request was successful
        if(response.ok) {
            response.json().then(function(data) {
                //pass data to dom function
                displayIssues(data);
                
                //check if api has paginated issues
                if(response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }else {
            document.location.replace("index.html")
        }
    })
}

var displayIssues = function(issues) {
    if(issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return
    }
    
    for(let i =0; i < issues.length; i++) {
        //create a link element to tkae users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        
        //create a span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        //append to container
        issueEl.appendChild(titleEl);
        
        //create a tyoe element 
        var typeEl = document.createElement("span");
        
        //check if issue us an actual issue or a pull request
        if(issues[i].pull_request){
            typeEl.textContent = "(pull request)";
        }else {
            typeEl.textContent = "(issue)";
        }
        
        //append to container
        issueEl.appendChild(typeEl)
        issueContainerEl.appendChild(issueEl);
    }
};

displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = " to see more than 30 issues. ";
    
    var linkEl = document.createElement("a");
    linkEl.textContent = "see more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank")
    
    limitWarningEl.appendChild(linkEl)
};


getRepoName();