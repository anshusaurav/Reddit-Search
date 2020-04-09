let resultPosts=[];
const ulElem = document.querySelector('.results-ul');
const inputElem = document.querySelector('.input');
const searchHeaderElem = document.querySelector('.sub-reddit');
const searchResElem = document.querySelector('.search-results');
const switchModeButton = document.querySelector('.toggle');
const bodyElem = document.querySelector('body');
searchResElem.style.display = 'none';
let isDM = false;
// if(localStorage.getItem('isDarkMode' )){
//     isDM = JSON.parse( localStorage.isDarkMode );
//     console.log('dsaijdoajsojdowqoei-021i0e-8-0483-0293-219-31o2   ==============>>>>>>>>>>>>>>>>' + isDM + '|'+ localStorage.isDarkMode+'|');
// }
// else
//     isDM = false;

inputElem.addEventListener('keyup', updateUi);
switchModeButton.addEventListener('input', switchMode);
async function showTopic(topicName) {
    let posts,response;
    response = await fetch(`https://api.reddit.com/r/${topicName}`);
    
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
                        <div class='score-innder-div'>
                            <div class='vote-div'>
                                <img src="upB.png" alt='search-mark' class='vote-img'>
                            </div>
                            <h2 class='updownscore'>${getCounts(post.data.score)}</h2>
                            <div class='vote-div'>
                                <img src="downB.png" alt='search-mark' class='vote-img'>
                            </div>
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
    let url = post.data.url || post.data.thumbnail;
    console.log('url: '+url);
    let miscElem = liElem.querySelector('.misc');
    console.log(url);
    //url = url.replace("watch?v=", "v/");
    if((url.startsWith('https')||url.startsWith('http')) && (url.endsWith('jpeg')||url.endsWith('png')||url.endsWith('jpg')||url.endsWith('gif'))){
        miscElem.innerHTML=`<img class="misc-img"
        title="Inline Frame Example"
        src=${url}>`;
        console.log('Thi should be included ' +url);
    }
    else if(url.indexOf('yout')!=-1){
        var video_id = youtube_parser(url);
        let newUrl = `https://www.youtube.com/embed/${video_id}`;
        miscElem.innerHTML = `<iframe src=${newUrl} class='misc-iframe'
        width="95%" height="360" frameborder="0" allowfullscreen></iframe>`
    }
    else if(url.indexOf('gfycat.com/')!=-1){
        let urlArr = url.split('/');
        
        //var video_id = 'https://gfycat.com/ifr/' + urlArr[urlArr.length-1];
        let newUrl = 'https://gfycat.com/ifr/' + urlArr[urlArr.length-1];
        miscElem.innerHTML = `<iframe src=${newUrl} class='misc-iframe'
        width="95%" height="360" frameborder="0" allowfullscreen></iframe>`  
    }
    // else if(url.indexOf('imgur')!=-1){
    //     miscElem.innerHTML = `<iframe src=${url} class='misc-iframe'
    //     width="95%" height="auto" frameborder="0" allowfullscreen></iframe>` 
    // }
    else{
        miscElem.style.display = 'none';
    }
    // <div style='position:relative; padding-bottom:calc(124.69% + 44px)'><iframe src='https://gfycat.com/ifr/PointlessBlushingChanticleer' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>
    ulElem.append(liElem);
}
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}
function updateUi(event){
    
    if(event.keyCode == 13) {
        reset();
        
        let value = this.value;
        
        
        showTopic(value);
        searchResElem.style.display = 'block';
        searchHeaderElem.innerHTML = `r/${value}`;
        
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
    let loginButton = document.querySelector('.login-button');
    loginButton.classList.toggle('grey-mod2');
    let signupButton = document.querySelector('.signup-button');
    signupButton.classList.toggle('grey-mod');
    //localStorage.setItem('isDarkMode', JSON.stringify(isDM));
    
}

showTrending();
  