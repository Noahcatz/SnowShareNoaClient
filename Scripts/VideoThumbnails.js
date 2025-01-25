async function FetchVideoInfo() {
    const response = await fetch("https://ikelene.ca/api/manifest.json", {
        method: "post"
    })
    const json = await response.json()
    return json
}

function DisplayVideo(JsonObject){
    console.log(JsonObject)
    

    const anchor = document.createElement('a')
    anchor.classList.add("VideoCard")
    anchor.href = `Watch.html?v=${btoa(JsonObject.file_name)}`

    if (JsonObject.thumbnail){
    const VideoThumb = document.createElement('img')
    VideoThumb.src = `https://ikelene.ca/media/thumbnail/${JsonObject.thumbnail}`
    anchor.append(VideoThumb)
    }else{
    const VideoThumb = document.createElement('video')
    VideoThumb.src = `https://ikelene.ca/media/uploads/${JsonObject.file_name}`
    anchor.append(VideoThumb)
    }


    const MainText = document.createElement('h1')
    MainText.textContent = JsonObject.title
    anchor.append(MainText)

    if (JsonObject.username) {
    const AuthorSpan = document.createElement('span')
    AuthorSpan.textContent = `by ${JsonObject.username}`
    MainText.append(AuthorSpan)
    }

    const ExtraContentSpan = document.createElement('span')

    const LikesIcon = document.createElement('img')
    LikesIcon.src = "Media/Likes.svg"
    LikesIcon.id = "LikesIcon"
    ExtraContentSpan.append(LikesIcon)

    const LikesValue = document.createElement('h3')
    LikesValue.textContent = JsonObject.likes
    ExtraContentSpan.append(LikesValue)

       const ViewsIcon = document.createElement('img')
       ViewsIcon.src = "Media/Views.svg"
       ViewsIcon.id = "ViewsIcon"
       ExtraContentSpan.append(ViewsIcon)

      const ViewsValue = document.createElement('h3')
      ViewsValue.textContent = JsonObject.views == undefined ? 0 : JsonObject.views
      ExtraContentSpan.append(ViewsValue)

    MainText.append(ExtraContentSpan)

    document.querySelector(".VideoListContainer").append(anchor)
}

FetchVideoInfo().then((VideoArray) => {
    VideoArray.reverse().forEach(JsonObject => {
        DisplayVideo(JsonObject)
    });
})