/*
  Newbie Script By Sahil Parray
*/
console.log("Script Loaded!");

const video = document.querySelector("video");
const textElm = document.querySelector("#image-text");

const constraints = {
  video: {
    facingMode: { ideal: "environment" },
  },
};
async function setup() {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
}
setup();

video.addEventListener("playing", async () => {
  const worker = Tesseract.createWorker();
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  const canvas = document.createElement("canvas");
  canvas.width = video.width;
  canvas.height = video.height;

  document.addEventListener("keypress", async (e) => {
    if (e.code !== "Space") return;
    canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height);
    const {
      data: { text },
    } = await worker.recognize(canvas);
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
    );
    textElm.textContent = text;
  });
});
