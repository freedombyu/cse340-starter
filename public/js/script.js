const reviews = [
  {
    commment: "So fast, it's almost like traveling in time.",
    rate: 4,
  },
  {
    commment: 'Coolest ride on the road.',
    rate: 4,
  },
  {
    commment: "I'm feeling McFly!",
    rate: 5,
  },
  {
    commment: 'The most futuristic ride of our day.',
    rate: 4.5,
  },
  {
    commment: "80's livin and I love it!",
    rate: 5,
  },
];

document.getElementById('reviews-container')?.append(
  ...reviews.map((review) => {
    const li = document.createElement('li');
    li.innerHTML = `${review.commment} (${review.rate}/5)`;
    return li;
  })
);

const upgrades = [
  {
    imageUrl: '/images/upgrades/flux-cap.png',
    imageCaption: 'Flux Capacitor',
  },
  {
    imageUrl: '/images/upgrades/flame.jpg',
    imageCaption: 'Flame Decals',
  },
  {
    imageUrl: '/images/upgrades/bumper_sticker.jpg',
    imageCaption: 'Bumper Stickers',
  },
  {
    imageUrl: '/images/upgrades/hub-cap.jpg',
    imageCaption: 'Hub Caps',
  },
];

document.getElementById('upgrades-container')?.append(
  ...upgrades.map((upgrade) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    figure.append(img, figcaption);
    card.append(figure);
    img.setAttribute('src', upgrade.imageUrl);
    img.setAttribute('alt', upgrade.imageCaption);
    img.setAttribute('width', 200);
    img.setAttribute('height', 200);
    figcaption.innerHTML = upgrade.imageCaption;
    return card;
  })
);

const heroCardData = [
  {
    feature: '3 Cup holders',
  },
  {
    feature: 'Superman doors',
  },
  {
    feature: 'Fuzzy dice!',
  },
];

document.getElementById('hero-features')?.append(
  ...heroCardData.map((feature) => {
    const li = document.createElement('li');
    li.innerHTML = `${feature.feature}`;
    return li;
  })
);

const currentCar = 'Delorean';

Array.from(document.getElementsByClassName('current-car')).forEach(
  (element) => {
    element.innerHTML = currentCar;
  }
);

const eyeIcon = document.getElementById('eye-icon');
eyeIcon?.addEventListener('click', () => {
  const passwordInput = document.getElementById('password');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.src = '/images/site/eye-open.png';
  } else {
    passwordInput.type = 'password';
    eyeIcon.src = '/images/site/eye-close.png';
  }
});

const addReviewBtn = document.getElementById('add-review-btn');
addReviewBtn?.addEventListener('click', () => {
  console.log('clicked');
  const modal = document.getElementById('add-review-dialog');
  modal.showModal();
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.close();
  });
});
