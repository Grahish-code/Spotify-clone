console.log('Lets write JavaScript');

let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3008/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


  // show all the song in the list
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="msuic.svg" alt="">
    <div class="info">
        <div>${song//.replace("_320(PaglaSongs)","")//
      }</div>
        </div>
    <div class="playnow">
        <span>Play now</span>
      <img class="invert" src="playbutton.svg" alt="">  
    </div>
     </li>`;
  }
  // Attach an event listner to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

}
const PlayMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentsong.src = `/${currFolder}/` + track
  if (!pause) {
    currentsong.play()
    play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = " 00:00 / 00:00 "


}
async function displayAllAlbums() {
  console.log("displaying albums");
  
  let a = await fetch(`http://127.0.0.1:3008/songs`)

  let response = await a.text();

  let div = document.createElement("div")

  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a")

  let cardcontainer=document.querySelector(".cardcontainer")

  let array=Array.from(anchors)

for (let index = 0; index < array.length; index++) {
  const e = array[index];
  
if (e.href.includes("/songs")) {
      let folder = (e.href.split("/").slice(-2)[0]);
// get the metadata of the folder 
let a = await fetch(`http://127.0.0.1:3008/songs/${folder}/info.json`)
  let response = await a.json();
  console.log(response);
  cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">

  <div class="playbutton">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
              stroke-linejoin="round" fill="#000" />
      </svg>
  </div>

  <img src="/songs/${folder}/cover.png" alt="">
  <h2>${response.title}</h2>
  <p>${response.description} </p>
</div>`
  
    }

  }
  //Load the playlist Whenever the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

    })

  })

}

async function main() {
  // get the list of songs
  await getSongs("songs")
  PlayMusic(songs[0], true)

  // display all the albums on the page
  displayAllAlbums()

  // Attach an event listner to play,next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      play.src = "pause.svg"
    }
    else {
      currentsong.pause()
      play.src = "playbutton.svg"
    }
  })

  //listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentsong.currentTime)}
  /${secondsToMinutesAndSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })

  // Add an event Listner to seekbar 
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
  })


  // add an event Listner to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";

  }
  )
  // add an event listner to cross
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";

  }
  )

  // Add an event Listener to previous
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    console.log(currentsong);
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])//index of current song , inshot positin of current song
    if ((index - 1) >= 0) {
      PlayMusic(songs[index - 1]) // agar piche jana hai to current posisiton -1
    }
  })

  // Add an event listner to next
  next.addEventListener("click", () => {
    console.log("next clicked");
    console.log(currentsong);
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])//index of current song , inshot positin of current song
    if ((index + 1) < songs.length) {
      PlayMusic(songs[index + 1]) // to agar aage badhna hai to current song ki position +1
    }
  })


  // Add an event Listner to Volume 
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("setting volume to ", e.target.value, "/100");
    let volValue = currentsong.volume = parseInt(e.target.value) / 100;
    volValue;

    if (volValue !== 0) {
      document.querySelector(".volume").getElementsByTagName("img")[0].setAttribute("src", "volume.svg")
    }
    else {
      document.querySelector(".volume").getElementsByTagName("img")[0].setAttribute("src", "mute.svg")
    }

  })




}
main()


