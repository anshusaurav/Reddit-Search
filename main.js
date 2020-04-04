async function showTopic(topicName) {

    // read our JSON
    let response = await fetch(`https://api.reddit.com/r/${topicName}`);
    let posts = await response.json();
  
    //console.log(posts)
    return posts;
  }
  