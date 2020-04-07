let resultPosts=[];
const ulElem = document.querySelector('.results-ul');
const inputElem = document.querySelector('.input');
const searchHeaderElem = document.querySelector('.sub-reddit');
const searchResElem = document.querySelector('.search-results');
const switchModeButton = document.querySelector('.light-dark');
const bodyElem = document.querySelector('body');
searchResElem.style.display = 'none';
let isDarkMode = false;
inputElem.addEventListener('keyup', updateUi);
switchModeButton.addEventListener('click', switchMode);
async function showTopic(topicName) {
    let posts;
    let response = await fetch(`https://api.reddit.com/r/${topicName}`);
    posts = await response.json();
    console.log('search');
    console.log(posts);
    resultPosts.push(...posts.data.children);
    //console.log(resultPosts);
    resultPosts.forEach(elem=>createLiElem(elem));
}
async function showTrending() {
    let posts;
    let response = await fetch(`https://api.reddit.com/r/popular/`);
    posts = await response.json();
    console.log('Trend');
    console.log(posts);
    resultPosts.push(...posts.data.children);
    //console.log(resultPosts);
    resultPosts.forEach(elem=>createLiElem(elem));
    searchHeaderElem.innerHTML = `Trending Subreddits`;
    searchResElem.style.display = 'block';
}
function createLiElem(post){
    // ulElem.innerHTML
    // <li class='li-item'>
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
                            <img src="up.png" alt='search-mark' class='vote-img'>
                        </div>
                        <h2 class='updownscore'>${getCounts(post.data.score)}</h2>
                        <div class='vote-div'>
                            <img src="down.png" alt='search-mark' class='vote-img'>
                        </div>
                    </div>
                    <div class='post-details-div'>
                        <div>
                            <a class='li-first-line' href=${"https://www.reddit.com/user/" +post.data.author }>Posted by u/${post.data.author}</a><span class='time-span'> ${strDate} ${daysBetweenDate(post.data.created)}</span>
                        </div>
                        <a class='post-topic' href=${"https://www.reddit.com" + post.data.permalink}>${post.data.title}</a>
                        <p class='post-description'>${post.data.selftext}</p>
                        <div class='misc'>

                        </div>
                        <div class='li-footer'>
                            <div class='comment-div'>
                                <div class='comment-img'>
                                    <a href=${"https://www.reddit.com" + post.data.permalink}>
                                        <img src='comments.jpg' class='comment-image'/>
                                    </a>
                                </div>
                                <h6 class = 'comment-num-div'>${getCounts(post.data.num_comments)} comments</h6>
                            </div>
                        </div>
                    </div>`;
    let url = post.data.url;
    let miscElem = liElem.querySelector('.misc');
    console.log(url);
    url = url.replace("watch?v=", "v/");
    if((url.startsWith('https')||url.startsWith('http')) && (url.endsWith('jpeg')||url.endsWith('png')||url.endsWith('jpg')||url.endsWith('gif'))){
        miscElem.innerHTML=`<iframe class="iframeelem"
        title="Inline Frame Example"
        src=${url}>
        </iframe>`;
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
     console.log(ulElem.childElementCount);
        while(ulElem.firstChild)
            ulElem.removeChild(ulElem.firstChild);
        console.log(ulElem.childElementCount);

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
    let d1= new Date(Date.now());
    //console.log(dt+'|');
    let d2 = new Date(dt);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((d1 - d2) / oneDay));
    return diffDays;
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
    
}
showTrending();
  