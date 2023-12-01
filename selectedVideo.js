// const API_KEY = "AIzaSyDc9OOshV9-8IUjdQYgD1G0y3_QZl0xXKA";
// const BASE_URL = "https://www.googleapis.com/youtube/v3";

let urlParam = new URLSearchParams(window.location.search);

let videoID = urlParam.get("videoId");
let VideoContainer = document.getElementById("mainVideo");

// window.postMessage(message, "http://127.0.0.1:5500");

window.addEventListener("load", () => {
  if (YT) {
    new YT.Player(VideoContainer, {
      height: "400",
      width: "100%",
      videoId: videoID,
    });
  }
});

// getting data on sesion storage
let getSelectedVideoInfo;

const videoInfoString = sessionStorage.getItem("selectedVideoInformation");
if (videoInfoString) {
  getSelectedVideoInfo = JSON.parse(videoInfoString);

  // console.log(getSelectedVideoInfo);
}

//cal like count

function calculateLikes(likeCount) {
  let displayViews;
  let count;
  if (likeCount < 1000) {
    displayViews = likeCount;
  } else if (likeCount >= 1000 && likeCount <= 999999) {
    displayViews = (likeCount / 1000).toFixed(1) + " " + "K";
  } else if (likeCount >= 1000000) {
    displayViews = (likeCount / 1000000).toFixed(1) + " " + "M";
  }

  return displayViews;
}

let correctLikeCount = calculateLikes(getSelectedVideoInfo.likeCount);

let correctSubscriberCount = calculateLikes(getSelectedVideoInfo.subscribers);





// displaying selected video info
let selectedVideoInfo = document.getElementById("mainVideoInfo");

selectedVideoInfo.innerHTML = `
<h3>${getSelectedVideoInfo.videoTitle}</h3>
        <div class="videoInfo">
          <div class="channel">
            <img src="${getSelectedVideoInfo.channelLogo}" />
            <div>
              <h4>${getSelectedVideoInfo.channelName}</h4>
              <p>${correctSubscriberCount} subscribers</p>
            </div>
            <button class="subscribe">Subscribe</button>
          </div>

          <div  class="channel">
            <button class="likeButton">
                <i class="fa-regular fa-thumbs-up" style="color: #080808;"></i>
                <pre>${correctLikeCount}</pre>
                <div class="horizontalLine"></div>
                <i class="fa-regular fa-thumbs-down" style="color: #080808;"></i>
            </button>
            <button class="likeButton">
                <i class="fa-regular fa-share-from-square" style="color: #0a0a0a;"></i>
                Share
            </button>
            <button class="likeButton">
                <i class="fa-solid fa-ellipsis" style="color: #0c0d0d;"></i>
            </button>
          </div>
        </div>`;

// get comments
async function getComments(specificvideoID) {
  try {
    let response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${specificvideoID}&maxResults=20&part=snippet`)
    // let response = await fetch("./comments.json");

    const data = await response.json();

    let commentsArr = data.items;

    // console.log(commentsArr);
    displayComments(commentsArr);
  } catch (err) {
    console.log(err);
  }
}

getComments(videoID);

let userCommentDiv = document.getElementById("userCommentSection");

function displayComments(data) {
  for (let ele of data) {
    // console.log(ele);
    let individualCommentDiv = document.createElement("div");

    individualCommentDiv.innerHTML = `
<div class="userComment channel">
            
              <img src="${ele.snippet.topLevelComment.snippet.authorProfileImageUrl}">
              
          
          <div class="userCommented">
              <p>@${ele.snippet.topLevelComment.snippet.authorDisplayName}</p>
              <p>${ele.snippet.topLevelComment.snippet.textDisplay}</p>
          </div>
          </div>
          <div class="comentLikeDislike">
           <div>
            <i class="fa-regular fa-thumbs-up" style="color: #080808"></i>

            <i class="fa-regular fa-thumbs-down" style="color: #080808"></i>
          </div>
          <p>Reply</p>

          </div>
`;
    userCommentDiv.appendChild(individualCommentDiv);
  }
}

// get recommended videos

let recommendedSectionDiv = document.getElementById("recommendedVideo");
async function getRecommendedVideos(videoTitle) {
  try {
    

    let response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${videoTitle}&maxResults=16&part=snippet`);
    
    // const response = await fetch(`./recommendedVideo.json`);

    let data = await response.json();

    let arr = data.items;
    

    displayRecommendedData(arr);
    

    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
getRecommendedVideos(getSelectedVideoInfo.videoTitle);


async function displayRecommendedData (data) {

console.log("erf");
  recommendedSectionDiv.innerHTML = "";
  for (const ele of data) {
     console.log(ele);

    let viewCountObj = await getVideoInfo(ele.id.videoId);
       console.log(viewCountObj);
    ele.viewObject = viewCountObj; // enjected array as object in ele object

    let channelInfoObject = await getChannelLogo(ele.snippet.channelId);
       console.log(channelInfoObject);
    ele.channelObject = channelInfoObject;

    // let subscribers = await getSubscription(ele.snippet.channelId);

    // ele.subscriberCount = subscribers;

    //    console.log(ele.subscriberCount[0].statistics.subscriberCount);

    let displayDuration = calDuration(ele.snippet.publishedAt);

    let recommendedVideoCard = document.createElement("div");
    recommendedVideoCard.className = "recommenedvideoCard";

    recommendedVideoCard.innerHTML = `<img src="${ele.snippet.thumbnails.high.url}">
    <div>
    <div class="channel">
        
        <h4>${ele.snippet.title}</h4>
    </div>
    <div>
        <p>${ele.snippet.channelTitle}</p>
        <p> ${calculateViews(
          ele.viewObject[0].statistics.viewCount
        )} views , ${displayDuration} ago </p>
    </div>
    </div>`;


//     <div class="recommenedvideoCard">
//     <img>
//     <div>
//     <div class="channel">
       
//         <h4>frtghyuj juiklo tyhh huejekje nbdht4ihoe hthe</h4>
//     </div>
//     <div >
//         <p>erftg njii tg</p>
//         <p> cdrvv nu</p>
//     </div>
//   </div>


// </div>



    recommendedSectionDiv.appendChild(recommendedVideoCard);

  }

}

// like functionality

// let thumpUpButton = document.getElementById("thumpUP");

// let thumpDownButton = document.getElementById("thumpDown");

// console.log(thumpUpButton,thumpDownButton);


// comment functionality

let ownerComments = document.getElementById("ownerComment");

console.log(ownerComments);
ownerComments.addEventListener('keyup',addOwnerComment)

function addOwnerComment (event){

if(event.keyCode === 13 ){



}
}




