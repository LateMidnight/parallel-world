const stories = [
  {
    id: "about-food",
    index: "01",
    title: "关于他爱吃的（测试PILOT)",
    kicker: "Parallel 01",
    tag: "PHOTO TRIGGER 01",
    quote: "6.15 天气阴 手机震动收到你的短信 我划掉原句 写下今天天气晴",
    image: "assets/images/about-food.png",
    imageAlt: "王橹杰和穆祉丞坐在练习室地板上对视",
    media: "assets/media/about-food.mp4",
    mediaType: "video/mp4",
    track: "关于他爱吃的",
    short: "",
    body: [
      "M：“我好饿——”",
      "L：“你的外卖小弟正在路上”"
    ]
  }
];

const emptySlots = [
  {
    title: "未来待续",
    copy: ""
  }
];

const galleryGrid = document.querySelector("#galleryGrid");
const galleryPrev = document.querySelector("#galleryPrev");
const galleryNext = document.querySelector("#galleryNext");
const galleryCounter = document.querySelector("#galleryCounter");
const dialog = document.querySelector("#storyDialog");
const dialogImage = document.querySelector("#dialogImage");
const dialogTag = document.querySelector("#dialogTag");
const dialogKicker = document.querySelector("#dialogKicker");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogQuote = document.querySelector("#dialogQuote");
const dialogBody = document.querySelector("#dialogBody");
const dialogTrack = document.querySelector("#dialogTrack");
const dialogMedia = document.querySelector("#dialogMedia");
let galleryIndex = 0;

function renderGallery() {
  const storyCards = stories
    .map(
      (story) => `
        <div class="gallery-slide">
          <button class="story-card" type="button" data-open-story="${story.id}" aria-label="打开故事：${story.title}">
            <span class="card-image">
              <img src="${story.image}" alt="${story.imageAlt}">
              <span class="card-index">${story.index}</span>
            </span>
            <span class="card-copy">
              <span class="card-meta">
                <span>${story.kicker}</span>
                <span>OPEN</span>
              </span>
              <h3>${story.title}</h3>
              ${story.short ? `<p>${story.short}</p>` : ""}
            </span>
          </button>
        </div>
      `
    )
    .join("");

  const slots = emptySlots
    .map(
      (slot) => `
        <div class="gallery-slide">
          <div class="empty-card" aria-label="${slot.title}">
            <div>
              <span aria-hidden="true">+</span>
              <strong>${slot.title}</strong>
              ${slot.copy ? `<p>${slot.copy}</p>` : ""}
            </div>
          </div>
        </div>
      `
    )
    .join("");

  galleryGrid.innerHTML = storyCards + slots;
  updateGalleryCarousel();
}

function updateGalleryCarousel() {
  const total = galleryGrid.querySelectorAll(".gallery-slide").length;

  if (!total) {
    return;
  }

  galleryIndex = (galleryIndex + total) % total;
  galleryGrid.style.transform = `translateX(-${galleryIndex * 100}%)`;

  if (galleryCounter) {
    galleryCounter.textContent = `${String(galleryIndex + 1).padStart(2, "0")} / ${String(
      total
    ).padStart(2, "0")}`;
  }
}

function moveGallery(direction) {
  const total = galleryGrid.querySelectorAll(".gallery-slide").length;

  if (!total) {
    return;
  }

  galleryIndex = (galleryIndex + direction + total) % total;
  updateGalleryCarousel();
}

function findStory(id) {
  return stories.find((story) => story.id === id) || stories[0];
}

function fillStory(story) {
  dialogImage.src = story.image;
  dialogImage.alt = story.imageAlt;
  dialogTag.textContent = story.tag;
  dialogKicker.textContent = story.kicker;
  dialogTitle.textContent = story.title;
  dialogQuote.textContent = story.quote;
  dialogTrack.textContent = story.track;

  dialogBody.replaceChildren();
  story.body.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    dialogBody.appendChild(p);
  });

  dialogMedia.pause();
  dialogMedia.poster = story.image;
  dialogMedia.innerHTML = `
    <source src="${story.media}" type="${story.mediaType}">
    当前浏览器无法播放这个片段。
  `;
  dialogMedia.load();
}

function openStory(id) {
  const story = findStory(id);
  fillStory(story);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeStory() {
  dialogMedia.pause();
  dialog.close();
}

document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-open-story]");
  if (opener) {
    openStory(opener.dataset.openStory);
    return;
  }

  if (event.target.closest("[data-close-dialog]")) {
    closeStory();
  }
});

galleryPrev?.addEventListener("click", () => moveGallery(-1));
galleryNext?.addEventListener("click", () => moveGallery(1));

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isBackdropClick =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (isBackdropClick) {
    closeStory();
  }
});

dialog.addEventListener("close", () => {
  dialogMedia.pause();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog.open) {
    dialogMedia.pause();
  }
});

renderGallery();

if (window.location.hash === "#about-food" || window.location.hash === "#story-about-food") {
  openStory("about-food");
}
