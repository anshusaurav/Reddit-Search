async function showTopic(topicName) {

    try{
    // read our JSON
    let response = await fetch(`https://api.reddit.com/r
    /${topicName}`);
    let posts = await response.json();
    return posts;
    }catch(error){
        console.log(error.reason);
    };
  }
  