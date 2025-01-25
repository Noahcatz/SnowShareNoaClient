function LoadError(ErrorMsg){
    alert(`Failed to load video: ${ErrorMsg}`)
    location.href = "/"
}
async function GetVideoMetadata(FileName){
    const requestBody = {
        'video': FileName
    };

    console.log(await requestBody)
    const Response = await fetch("https://ikelene.ca/api/getVideoData.php", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: requestBody,
        method: "POST",
        mode: "no-cors"
    });
    const Json = await Response.json()
    return Json
}

const urlParams = new URLSearchParams(window.location.search)

if (!document.querySelector('.ActiveVideo video')){
    LoadError("No video element found")
}
if (!urlParams.get('v')){
    LoadError("No video query found")
}
async function IncreaseView() {
    const response = fetch("https://ikelene.ca/api/view.php", {
        method: "post"
    })

}
const VideoElement = document.querySelector('.ActiveVideo video')
try{
atob(urlParams.get('v'))
}catch{
LoadError("Invalid query encoding")
}
const VideoFileName = atob(urlParams.get('v'))


document.title = `${atob(urlParams.get('v')).split(".")[0]} - SnowShare`
VideoElement.src = `https://ikelene.ca/media/uploads/${VideoFileName}`

console.log(GetVideoMetadata("Skibidi fire in the hole.mp4"))