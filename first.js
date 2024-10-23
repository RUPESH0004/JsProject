const userInput = document.querySelector(".input-un");
const submitBtn = document.querySelector('.submit-btn')
const circle = document.querySelector('.states');
const state = document.querySelector('.state');
const easycircle = document.querySelector('.easy');
const mediumcircle = document.querySelector('.medium');
const hardcircle = document.querySelector('.hard');
submitBtn.addEventListener('click', function() {
    const username = userInput.value;
    console.log("logggin username: ", username);
    if(authentication(username)) {
        fetchUserDetails(username);
    }
})
function authentication(username) {
    if(username.trim() === "") {
        alert("Username should not be empty");
        return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if(!isMatching) {
        alert("Invalid Username");
    }
    return isMatching;
}
function updateProgress( total,solved, level) {
    const progressDegree = (solved/total)*100;
    level.style.setProperty("--progress-degree", `${progressDegree}%`);
    level.textContent = `${solved}/${total}`;
}

async function fetchUserDetails(username) {

    try{
        submitBtn.textContent = "Searching...";
        submitBtn.disabled = true;
        //statsContainer.classList.add("hidden");

        // const response = await fetch(url);
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
        const targetUrl = 'https://leetcode.com/graphql/';
        
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({
            query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
            variables: { "username": `${username}` }
        })
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
        };

        const response = await fetch(proxyUrl+targetUrl, requestOptions);
        if(!response.ok) {
            throw new Error("Unable to fetch the User details");
        }
        const parsedData = await response.json();
        console.log("Logging data: ", parsedData) ;

        displayUserData(parsedData);
    }
    catch(error) {
        circle.innerHTML = `<p>${error.message}</p>`
    }
    finally {
        submitBtn.textContent = "Search";
        submitBtn.disabled = false;
    }
}

function displayUserData(parsedData)
{
    
 const allData = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
 const EasyData =parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
 const MedimuData = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
 const HardData =parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
    updateProgress(allData, EasyData,easycircle);
    updateProgress(  allData,MedimuData ,mediumcircle);
    updateProgress( allData, HardData,hardcircle);

}
