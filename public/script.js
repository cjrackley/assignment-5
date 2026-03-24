"use strict";
(function () {

    window.addEventListener("load", init);

    function init() {
        getRepos("cjrackley");
    }

    id("search-btn").addEventListener("click", handleSearch);

    function handleSearch(){
        let username = id("username").value.trim();
        if (username) {
            getRepos(username);
        }
    }

    async function getRepos(username) {
        let repositoryDiv = id("repository-container");
        repositoryDiv.innerHTML = "";

        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
            .then(checkStatus)
            .then((response) => {
                if (response.length === 0) {
                    repositoryDiv.textContent = "No repositories found.";
                    return;
                }

                for (const item of response) {
                    addParagraph(repositoryDiv, item);
                }
            })
            .catch((error) => {
                repositoryDiv.textContent = "Error loading repositories.";
                console.error("Error: ", error);
            });
    }
    function addParagraph(repositoryDiv, repositoryObject) {
        let article = document.createElement("article");

        let heading = document.createElement("h3");

        let link = document.createElement("a");
        link.textContent = repositoryObject.name;
        link.href = repositoryObject.html_url;
        
        heading.appendChild(link);

        let para = document.createElement("p");

        function addLine(label, value) {
            let text = document.createTextNode(label + ": " + value);
            let br = document.createElement("br");
            para.appendChild(text);
            para.appendChild(br);
        }

        addLine("Description", repositoryObject.description);
        addLine("Created", repositoryObject.created_at.split("T")[0]);
        addLine("Updated", repositoryObject.updated_at.split("T")[0]);
        addLine("Watchers", repositoryObject.watchers_count);

        article.appendChild(heading);
        article.appendChild(para);
        repositoryDiv.appendChild(article);
    }


    function id(idName) {
        return document.getElementById(idName);
    }
    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response.json();
    }
})();