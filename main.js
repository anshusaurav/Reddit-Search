let resultPosts=[];
const ulElem = document.querySelector('.results-ul');
const inputElem = document.querySelector('.input');
const searchHeaderElem = document.querySelector('.sub-reddit');
const searchResElem = document.querySelector('.search-results');
const switchModeButton = document.querySelector('.toggle');
const bodyElem = document.querySelector('body');
searchResElem.style.display = 'none';
let isDM;
if(localStorage.getItem('isDarkMode' ))
    isDM = JSON.parse( localStorage.isDarkMode );
else
    isDM = false;

inputElem.addEventListener('keyup', updateUi);
switchModeButton.addEventListener('input', switchMode);
async function showTopic(topicName) {
    let posts;
    let response = await fetch(`https://api.reddit.com/r/${topicName}`);
    posts = await response.json();
    console.log('search');
    console.log(posts);
    resultPosts.push(...posts.data.children);
    resultPosts.forEach(elem=>createLiElem(elem));
}
async function showTrending() {
    let posts;
    let response = await fetch(`https://api.reddit.com/top/`);
    posts = await response.json();
    console.log('Trend');
    console.log(posts);
    resultPosts.push(...posts.data.children);
    resultPosts.forEach(elem=>createLiElem(elem));
    searchHeaderElem.innerHTML = `Trending Subreddits`;
    searchResElem.style.display = 'block';
}
function createLiElem(post){
    let strDate = '';
    if(daysBetweenDate(post.data.created_utc) == 0)
        strDate = 'Today';
    else if(daysBetweenDate(post.data.created_utc) == 1)
        strDate = 'Yesterday';
    else
        strDate = daysBetweenDate(post.data.created_utc) + ' days ago';


    let liElem = document.createElement('li');
    liElem.classList.add('li-item');
    liElem.innerHTML = `<div class='score-div'>
                        <div class='vote-div'>
                            <img src="upB.png" alt='search-mark' class='vote-img'>
                        </div>
                        <h2 class='updownscore'>${getCounts(post.data.score)}</h2>
                        <div class='vote-div'>
                            <img src="downB.png" alt='search-mark' class='vote-img'>
                        </div>
                    </div>
                    <div class='post-details-div'>
                        <div>
                            <p class='li-first-line'>Posted by <a class="author-name" href=${"https://www.reddit.com/user/" +post.data.author }>u/${post.data.author}</a></p><span class='time-span'> ${daysBetweenDate(post.data.created)}</span>
                        </div>
                        <a class='post-topic' href=${"https://www.reddit.com" + post.data.permalink}>${post.data.title}</a>
                        
                        <div class='misc'>

                        </div>
                        <div class='li-footer'>
                            <div class='comment-div'>
                                <div class='comment-img'>
                                    <a href=${"https://www.reddit.com" + post.data.permalink}>
                                        <img src='comments.jpg' class='comment-image'/>
                                    </a>
                                </div>
                                <h6 class = 'comment-num-div'>${getCounts(post.data.num_comments)} Comments</h6>
                            </div>
                        </div>
                    </div>`;
                    //<p class='post-description'>${post.data.selftext}</p>
    let url = post.data.url;
    let miscElem = liElem.querySelector('.misc');
    console.log(url);
    url = url.replace("watch?v=", "v/");
    if((url.startsWith('https')||url.startsWith('http')) && (url.endsWith('jpeg')||url.endsWith('png')||url.endsWith('jpg')||url.endsWith('gif'))){
        miscElem.innerHTML=`<img class="misc-img"
        title="Inline Frame Example"
        src=${url}>`;
        console.log('Thi should be included' +url);
    }
    else{
        miscElem.style.display = 'none';
    }
    ulElem.append(liElem);
}
function updateUi(event){
    
    if(event.keyCode == 13) {
       reset();
        let value = this.value;
        searchHeaderElem.innerHTML = `r/${value}`;
        showTopic(value);
        searchResElem.style.display = 'block';
    }
    
}
function reset()
{
    console.log(ulElem.childElementCount);
    while(ulElem.firstChild)
        ulElem.removeChild(ulElem.firstChild);
    console.log(ulElem.childElementCount);
    resultPosts = [];       
}
function daysBetweenDate(dt) {
    let d2 = new Date(dt*1000);
    return d2.toString().substr(0,21);
}

function getCounts(cnt) {
    let res;
    if(cnt >= 1000)
    {    
        res = cnt/1000;
        return res.toFixed(1)+'K';
    }
    return cnt;
    

}

function switchMode()
{
    isDM = !isDM;
    bodyElem.classList.toggle('dark');  
    let liArr = Array.from(document.querySelectorAll('.li-item'));
    liArr.forEach(elem=> elem.classList.toggle('grey-mod1'));
    let commentArr = Array.from(document.querySelectorAll('.comment-num-div'));
    commentArr.forEach(elem=> elem.classList.toggle('grey-mod2'));
    let postDetailsDiv = Array.from(document.querySelectorAll('.post-details-div'));
    postDetailsDiv.forEach(elem=> elem.classList.toggle('grey-mod1'));
    let scoresDiv = Array.from(document.body.querySelectorAll('.score-div'));
    scoresDiv.forEach(elem => {
        elem.classList.toggle('grey-mod');
    })

    let votesDiv = Array.from(document.body.querySelectorAll('.vote-div'));
    votesDiv.forEach(elem => {
        elem.classList.toggle('grey-mode4');
    })
    let votesImg = Array.from(document.body.querySelectorAll('.vote-img'));
    votesImg.forEach(elem => {
        elem.classList.toggle('grey-mode5');
    })
    let commentImgArr = Array.from(document.querySelectorAll('.comment-image'));
    commentImgArr.forEach(elem => elem.classList.toggle('grey-mode3'));

    let postTopicHs = Array.from(document.body.querySelectorAll('.post-topic'));
    postTopicHs.forEach(elem => elem.classList.toggle('dark-mode2'));
    
    let logoElem = document.body.querySelector('.reddit-logo');
    if(logoElem.getAttribute('src').endsWith('reddit-logoB.png'))
        logoElem.setAttribute('src','reddit-logoBC.png');
    else
        logoElem.setAttribute('src','reddit-logoB.png');

    let headElem = document.body.querySelector('.header');
    headElem.classList.toggle('grey-mod1');
    headElem.classList.toggle('grey-mod2');
    let inpElemHover = document.body.querySelector('.input');
    inpElemHover.classList.toggle('grey-misc');
    localStorage.setItem('isDarkMode', JSON.stringify(isDM));
    
}

showTrending();
  