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
    resultPosts.push(...posts.data.children);
    //console.log(resultPosts);
    resultPosts.forEach(elem=>createLiElem(elem));
}
async function showTrending() {
    let posts;
    let response = await fetch(`https://api.reddit.com/r/trending_subreddits`);
    posts = await response.json();
    console.log(posts);
    resultPosts.push(...posts.data.children);
    console.log(resultPosts);
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
                        <h3 class='li-first-line'>Posted by u/${post.data.author}<span class='time-span'> ${strDate}</span></h3>
                        <h4 class='post-topic'>${post.data.title}</h4>
                        <p class='post-description'>${post.data.selftext}</p>
                        <div class='misc'>

                        </div>
                        <div class='li-footer'>
                            <div class='comment-div'>
                                <div class='comment-img'>
                                    <a href=''>
                                        <img src='comments.jpg' class='comment-image'/>
                                    </a>
                                </div>
                                <h6 class = 'comment-num-div'>${post.data.num_comments} comments</h6>
                            </div>
                        </div>
                    </div>`;
    ulElem.append(liElem);
}
function updateUi(event){
    
    if(event.keyCode == 13) {
        ulElem.innerHTML = '';
        let value = this.value;
        searchHeaderElem.innerHTML = `r/${value}`;
        showTopic(value);
        searchResElem.style.display = 'block';
    }

}

function daysBetweenDate(dt) {
    let d1= new Date(Date.now());
    console.log(dt+'|');
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
        return res.toFixed(2);
    }
    return cnt;
    

}

function switchMode()
{
    bodyElem.classList.toggle('dark');
}
showTrending();
  