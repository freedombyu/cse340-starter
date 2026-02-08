// Reviews Data and Rendering
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

// Upgrades Data and Rendering
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

// Hero Features Data and Rendering
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

// Current Car Display
const currentCar = 'Delorean';

Array.from(document.getElementsByClassName('current-car')).forEach(
  (element) => {
    element.innerHTML = currentCar;
  }
);

// Password Visibility Toggle (for Login and Account Edit pages)
const eyeIcon = document.getElementById('eye-icon');
const passwordInput = document.getElementById('password');

if (eyeIcon && passwordInput) {
  eyeIcon.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.src = '/images/site/eye-open.png';
      eyeIcon.alt = 'eye open icon';
    } else {
      passwordInput.type = 'password';
      eyeIcon.src = '/images/site/eye-close.png';
      eyeIcon.alt = 'eye close icon';
    }
  });
}

// Add Review Modal
const addReviewBtn = document.getElementById('add-review-btn');
if (addReviewBtn) {
  addReviewBtn.addEventListener('click', () => {
    console.log('Add review button clicked');
    const modal = document.getElementById('add-review-dialog');
    if (modal) {
      modal.showModal();
      
      const closeModalBtn = document.getElementById('close-modal');
      if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
          modal.close();
        });
      }
    }
  });
}

// Form Validation Enhancement (optional)
const forms = document.querySelectorAll('.form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      alert('Please fill in all required fields.');
    }
  });
});

// Real-time password validation feedback
const passwordField = document.getElementById('password');
if (passwordField) {
  passwordField.addEventListener('input', () => {
    const value = passwordField.value;
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
    
    if (pattern.test(value)) {
      passwordField.classList.remove('invalid');
      passwordField.classList.add('valid');
    } else {
      passwordField.classList.remove('valid');
      passwordField.classList.add('invalid');
    }
  });
}