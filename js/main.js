document.addEventListener('DOMContentLoaded', function () {
	const navToggle = document.querySelector('.nav-toggle');
	const nav = document.querySelector('.site-nav');
	const year = document.getElementById('year');
	const backToTop = document.querySelector('.back-to-top');

	if (year) {
		year.textContent = new Date().getFullYear();
	}

	if (navToggle && nav) {
		navToggle.addEventListener('click', function () {
			const expanded = this.getAttribute('aria-expanded') === 'true';
			this.setAttribute('aria-expanded', String(!expanded));
			nav.classList.toggle('open');
		});
	}

	// Smooth scroll for in-page links
	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href').substring(1);
			const target = document.getElementById(targetId);
			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: 'smooth' });
				nav?.classList.remove('open');
				navToggle?.setAttribute('aria-expanded', 'false');
			}
		});
	});

	// Back to top
	window.addEventListener('scroll', function () {
		if (window.scrollY > 600) {
			backToTop?.classList.add('show');
		} else {
			backToTop?.classList.remove('show');
		}
	});
	backToTop?.addEventListener('click', function () {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	// Enquiry form -> Netlify Forms (native), no reload
	(function initNetlifyForm() {
		const form = document.querySelector('form[name="enquiry"][data-netlify="true"]');
		if (!form) return;
		const thanks = form.querySelector('.thanks');

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			const formData = new FormData(form);
			
			// Validate required fields
			const name = formData.get('name');
			const phone = formData.get('phone');
			if (!name || !phone) {
				alert('Name and phone are required.');
				return;
			}

			// Submit to Netlify Forms
			fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData).toString()
			})
			.then(function (res) {
				if (!res.ok) throw new Error('Failed to submit');
				return res;
			})
			.then(function () {
				if (thanks) { thanks.style.display = 'inline'; }
				form.reset();
			})
			.catch(function (err) {
				console.error('Form submission error:', err);
				alert('Sorry, we could not send your enquiry right now. Please try again later.');
			});
		});
	})();

	// Gallery multi-tile slideshow (4 tiles, 3s per tile)
	(function initGallerySlideshow() {
		const tiles = Array.from(document.querySelectorAll('.gallery-slideshow .slide-tile'));
		if (tiles.length === 0) return;

		const acImages = [
			'images/Ac/Ac.jpeg',
			'images/Ac/Ac (2).jpeg',
			'images/Ac/Ac (3).jpeg',
			'images/Ac/Ac (4).jpeg',
			'images/Ac/Ac (5).jpeg',
			'images/Ac/Ac (6).jpeg',
			'images/Ac/Ac (7).jpeg',
			'images/Ac/Ac (8).jpeg',
			'images/Ac/Ac (9).jpeg',
			'images/Ac/Ac (10).jpeg',
			'images/Ac/Ac (14).jpeg',
			'images/Ac/Ac (15).jpeg',
			'images/Ac/Ac (16).jpeg',
			'images/Ac/Ac (17).jpeg',
			'images/Ac/Ac (18).jpeg',
			'images/Ac/Ac (19).jpeg'
		];

		const teamImages = [
			'images/Ac/team.jpeg',
			'images/Ac/team (2).jpeg',
			'images/Ac/team (3).jpeg'
		];

		const allImages = acImages.concat(teamImages);

		function createStack(tile, srcList) {
			// keep the first existing <img> if present as initial active
			const firstImg = tile.querySelector('img');
			if (firstImg) {
				firstImg.src = srcList[0];
				firstImg.alt = firstImg.alt || 'Gallery image';
				firstImg.classList.add('active');
			}
			// add the rest of the stack hidden underneath for crossfade
			srcList.forEach(function (src, index) {
				if (index === 0) return; // already present
				const img = document.createElement('img');
				img.src = src;
				img.loading = 'lazy';
				img.alt = firstImg?.alt || 'Gallery image';
				tile.appendChild(img);
			});
		}

		// Initialize stacks per tile using mixed list with offsets
		tiles.forEach(function (tile, idx) {
			const offset = (idx * 4) % allImages.length;
			const list = allImages.slice(offset).concat(allImages.slice(0, offset));
			createStack(tile, list);
		});

		function rotate(tile) {
			const imgs = Array.from(tile.querySelectorAll('img'));
			if (imgs.length <= 1) return;
			let activeIndex = imgs.findIndex(function (img) { return img.classList.contains('active'); });
			if (activeIndex < 0) activeIndex = 0;
			const nextIndex = (activeIndex + 1) % imgs.length;
			imgs[activeIndex].classList.remove('active');
			imgs[nextIndex].classList.add('active');
		}

		// start timers per tile (4s)
		// Stagger changes so tiles don't flip at the same time
		tiles.forEach(function (tile, idx) {
			var baseIntervalMs = 4000; // target ~4s
			var startDelayMs = idx * 800; // cascade start
			function scheduleNext() {
				// small jitter to avoid long-term re-sync, +/- up to ~400ms
				var jitter = (Math.random() * 800) - 400;
				setTimeout(function () {
					rotate(tile);
					scheduleNext();
				}, Math.max(1000, baseIntervalMs + jitter));
			}
			setTimeout(scheduleNext, startDelayMs);
		});
	})();
});

