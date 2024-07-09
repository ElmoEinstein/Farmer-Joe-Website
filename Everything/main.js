///
//If you are inspecting this, please excuse the messy code as well as everything being on one script, this is my first time using JavaScript + 3JS and I also dont have much html/css experience.
///
import './style.css'
import { CSS2DObject, GLTFLoader, RenderPass } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { cos, label, max, min, overlay } from 'three/examples/jsm/nodes/Nodes.js';


window.addEventListener('DOMContentLoaded', (event) => {
  const openModalButtons = document
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1;

  //Set clickables
  let inResturaunt = false;

  let chairSelectNames = ["Chair", "Chair001"]

  let objectsAndTheirLinks = {
    "Cylinder013": "https://www.instagram.com/ilovemrseldon/",
    "SteamLogo_1": "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
    "SteamLogo_2": "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/", 
    "xlogo_1" : "https://x.com/FarmerJoeDev","xlogo_2" : "https://x.com/FarmerJoeDev",
    "youtubelogo" : "https://www.youtube.com/channel/UCzgqXxoU5p3R8y6DLE333-g",
    "Insta_1" : "https://www.instagram.com/kkasperlowe/?next=%2F"
  ,"Insta_2" : "https://www.instagram.com/kkasperlowe/?next=%2F"
  };

  let objectsWithPopups = {"Menu" : "#menu", "Radio" : "#radio", "Cube022": "#about_me", "Cylinder001_1": "#game-jams", "Cylinder001_2": "#game-jams", "Cylinder001_3": "#game-jams", "Cylinder001": "#game-jams", "Sphere002" : "#farmer-joe", "Sphere002_1" : "#farmer-joe"};

  let objectsAbleToBeHighlighted = [/*"xlogo_1","xlogo_2", "youtubelogo", "SteamLogo",*/"Cube004","Radio","Cube022","Chair","Chair001"]

  //Keep the 3D object on a global variable so we can access it later
  let object;

  let INTERSECTED;

  //Set which object to render
  let objToRender = 'resturaunt';

  //Instantiate a loader for the .gltf file
  const loader = new GLTFLoader();


  //Music Player
  const playBtn = document.querySelector('#mainPlayBtn');
  const audio = document.querySelector('#audio');
  const btnPrev = document.querySelector('#btnPrev');
  const btnNext = document.querySelector('#btnNext');
  const trackTitle = document.querySelector('.track-title');
  const artistName = document.querySelector('.artist-name');
  const slider = document.querySelector('.slider');
  const thumb = document.querySelector('.slider-thumb');
  const progress = document.querySelector('.progress');
  const time = document.querySelector('.time');
  const fullTime = document.querySelector('.fulltime');
  const volumeSlider = document.querySelector('.volume-slider .slider');
  const volumeProgress = document.querySelector('.volume-slider .progress');
  const volumeIcon = document.querySelector('.volume-icon');

// Global Variables
// Is the track playing
let trackPlaying = false;

let volumeMuted = false;

let trackId = 0;

const tracks = [
  "THE CUBE",
  "SAD SYNTH"
];

const artists = [
  "Kasper Lowe",
  "Kasper Lowe"
];

playBtn.addEventListener('click', PlayTrack);

function PlayTrack(){
  if(trackPlaying == false){
    audio.play();

    playBtn.innerHTML = '<span class="material-symbols-outlined">⏸️</span>'
    
    trackPlaying = true;
    
  }else{
    audio.pause();

    playBtn.innerHTML = '<span class="material-symbols-outlined">▶️</span>'
    
    trackPlaying = false;
  }
}

function SwitchTracks(){
  if(trackPlaying == true){
    audio.play();
  }

}

const trackSrc = "public/Sound/Songs/" + tracks[trackId] + ".mp3";


function LoadTrack(){
  audio.src = "public/Sound/Songs/" + tracks[trackId] + ".mp3";

  audio.load();

  trackTitle.innerHTML = tracks[trackId];

  artistName.innerHTML = artists[trackId];

  progress.style.width = 0;

  thumb.style.left = 0;


  audio.addEventListener('loadeddata', () =>{
    SetTime(fullTime, audio.duration);

    slider.setAttribute("max", audio.duration);
  })

}


//Load first track

LoadTrack();

btnPrev.addEventListener('click', () =>{
  trackId--;

  if(trackId < 0){
    trackId = track.length - 1;
  }

  LoadTrack();

  SwitchTracks();
})



btnNext.addEventListener("click", NextTrack);

function NextTrack(){
  trackId++;  
  if(trackId > tracks.length - 1){
    trackId = 0;
  }

  LoadTrack();

  SwitchTracks();
}

audio.addEventListener('ended', NextTrack);

function SetTime(output, input){
  const minutes = Math.floor(input / 60);
  const seconds = Math.floor(input % 60);

  if(seconds < 10){
    output.innerHTML = minutes + ":0" + seconds;
  }else{
    output.innerHTML = minutes + ":" + seconds;
  }
}
SetTime(fullTime, audio.duration);

audio.addEventListener('timeupdate',() => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const percentage = (currentTime / duration) * slider.getAttribute("max");
  
  // Update slider value and thumb position
  slider.value = percentage;
  thumb.style.left = percentage + '%';
  
  // Update progress bar width if needed
  progress.style.width = 100;
  
  // Update time display
  SetTime(time, currentTime);
  
});

function CustomSlider(){
  const val = (slider.value / audio.duration) * slider.getAttribute("max") + '%';

  //progress.style.width = val;
  thumb.style.left = val;

  SetTime(time, slider.value);

  audio.currentTime = slider.value;

}
CustomSlider();

let val;

//try and use this and then set slider instead of doing shitty other way
function CustomVolumeSlider(){
  const maxVal = volumeSlider.getAttribute("max");

  val = (volumeSlider.value/maxVal) * 100 + '%'

  audio.volume = volumeSlider.value /100;
}

CustomVolumeSlider();

volumeSlider.addEventListener(
  "input", CustomVolumeSlider
);

slider.addEventListener("input", CustomSlider)

/*function setTime(element, duration) {

  element.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}*/
  
//POPUPS!!!
  const openModalButton = document.querySelectorAll('[data-modal-target]');
  const closeModalButton = document.querySelectorAll('[data-close-button]');
  const overlay = document.getElementById("overlay");

  openModalButton.forEach( button => {
    console.log("ear");
    button.addEventListener("click", () =>{
      const modal = document.querySelector(button.dataset.modalTarget);
      console.log(button.dataset.modalTarget);
      OpenModal(modal);
    }) 
  })
  
  closeModalButton.forEach( button => {
    button.addEventListener("click", () =>{
      const modal = button.closest(".modal");
      CloseModal(modal);
    })
  })
  

  overlay.addEventListener("click", () =>{
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal =>{
      CloseModal(modal);
    })
  })

  function CloseModal(modal){
    if(modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }

  function OpenModal(modal){
    if(modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
  }



  /*let div = document.createElement('div');
  div.appendChild(p);
  let divContainer = new CSS2DObject(div);
  scene.add(divContainer);

  divContainer.position.set(0,1,0);*/


//General Stuff

  //Load the file
  loader.load(
    `public/${objToRender}/scene.gltf`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );

  //Instantiate a new renderer and set its size
  const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //Add the renderer to the DOM
  document.getElementById("container3D").appendChild(renderer.domElement);

  //Set how far the camera will be from the 3D model
  camera.position.z = objToRender === "resturaunt" ? 7 : 500;

  //Listerners
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onMouseClick, false);
  window.addEventListener('pointerMove', onPointerMove, false);

  function animate() {
    requestAnimationFrame(animate);

    //Textbox renderer
    //textboxRenderer.render(scene, camera);


    //Colors
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the raycaster
    const intersects = raycaster.intersectObjects(scene.children);

    // Reset color of all objects
    scene.children.forEach(obj => {
        if (obj.isMesh && obj !== INTERSECTED) {
            obj.material.color.set(0xffffff);
        }
    });

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            // Restore previous intersected object (if any) to its original color
            if (INTERSECTED) INTERSECTED.material.color.set(0xffffff);

            // Store reference to the new intersected object
            INTERSECTED = intersects[0].object;
            if(objectsAbleToBeHighlighted.includes(intersects[0].object.name)){
              INTERSECTED.material.color.set(0xAAFF00);

            }
            // Change color of the new intersected object
        }
    } else {
        // Restore previous intersected object (if any) to its original color
        if (INTERSECTED) INTERSECTED.material.color.set(0xffffff);
        INTERSECTED = null;
    }


    if (object && objToRender === "resturaunt") {
      //I've played with the constants here until it looked good 
      object.rotation.y = -1.57;
      object.rotation.x = 0.2;
      
    }

    renderer.render(scene, camera);
  }

  //LISTENERS

  const raycaster = new THREE.Raycaster();
  const _mouseVector = new THREE.Vector2();

  function onPointerMove(){
    _mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    _mouseVector.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }




  // Event listener for mouse clicks. Detects when objects are clicked.
  function onMouseClick(event) {
    
    _mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    _mouseVector.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(_mouseVector, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        console.log('Object clicked:', intersects[0].object);

          // Log to the console
          if(inResturaunt == false){
            for (let i = 0; i < chairSelectNames.length; i++) {
                        
              if(chairSelectNames.includes(intersects[0].object.name)){
                console.log('Object clicked:', intersects[0].object);
                camera.lookAt(0,2,0);
                camera.position.set(camera.position.x,1.5,3)
                camera.setFocalLength(20);
                inResturaunt = true
              }
            }
          }else{
            for (const key in objectsAndTheirLinks) {

              if (objectsAndTheirLinks.hasOwnProperty(intersects[0].object.name)) {
                window.open(objectsAndTheirLinks[intersects[0].object.name]);
              }

            }
          }

          for (const key in objectsWithPopups) {

            if (objectsWithPopups.hasOwnProperty(intersects[0].object.name)) {
              const modal = document.querySelector(objectsWithPopups[intersects[0].object.name]);
              OpenModal(modal);
            }

          }

          


      }
  }

  const mouse = new THREE.Vector2();
  function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }




  //Add a listener to the window, so we can resize the window and the camera
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //textboxRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
  });



  //Start the 3D rendering
  animate();
});